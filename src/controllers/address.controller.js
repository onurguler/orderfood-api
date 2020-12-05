const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { Address } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * @route   /api/v1/addresses
 * @method  POST
 * @desc    Create a new address
 * @access  private
 */
exports.createAddress = asyncHandler(async (req, res) => {
  const { title, text, directionsTo, isDeliveryAddress } = req.body;

  const session = await Address.startSession();
  session.startTransaction();

  try {
    const address = await Address.create([{ user: req.user.id, title, text, directionsTo }], { session });

    if (isDeliveryAddress) {
      await Address.findOneAndUpdate(
        { _id: { $ne: address.id }, user: req.user.id, isDeliveryAddress: true },
        { isDeliveryAddress: false },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(httpStatus.CREATED).json({ address });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new Error();
  }
});

/**
 * @route   /api/v1/addresses
 * @method  GET
 * @desc    Get my addresses
 * @access  private
 */
exports.getMyAdresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user.id });
  res.json({ addresses });
});

/**
 * @route   /api/v1/addresses/delivery
 * @method  GET
 * @desc    Get my delivery address
 * @access  private
 */
exports.getMyDeliveryAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ user: req.user.id, isDeliveryAddress: true });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Delivery address not found!');
  }
  res.json({ address });
});

/**
 * @route   /api/v1/addresses/:address
 * @method  GET
 * @desc    Get address
 * @access  private
 */
exports.getAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.address, user: req.user.id });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Delivery address not found!');
  }
  res.json({ address });
});

/**
 * @route   /api/v1/addresses/:address/mark-as-delivery
 * @method  PUT
 * @desc    Mark as delivery address
 * @access  private
 */
exports.markAsDeliveryAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.address, user: req.user.id, isDeliveryAddress: false });

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');
  }

  const session = await Address.startSession();
  session.startTransaction();

  try {
    await Address.findOneAndUpdate(
      { user: req.user.id, isDeliveryAddress: true },
      { isDeliveryAddress: false },
      { session }
    );

    address.isDeliveryAddress = true;
    await address.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ address });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new Error();
  }
});

/**
 * @route   /api/v1/addresses/:address
 * @method  PATCH
 * @desc    Update address
 * @access  private
 */
exports.updateAddress = asyncHandler(async (req, res) => {
  const { title, text, directionsTo, isDeliveryAddress } = req.body;
  const updateBody = { title, text, directionsTo, isDeliveryAddress };

  const address = await Address.findOne({ _id: req.params.address, user: req.user.id });

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');
  }

  const session = await Address.startSession();

  try {
    Object.assign(address, updateBody);

    if (isDeliveryAddress) {
      await Address.findOneAndUpdate(
        { user: req.user.id, isDeliveryAddress: true },
        { isDeliveryAddress: false },
        { session }
      );
    }

    await address.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ address });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new Error();
  }
});

/**
 * @route   /api/v1/addresses/:address
 * @method  DELETE
 * @desc    Mark as delivery address
 * @access  private
 */
exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndRemove({ _id: req.params.address, user: req.user.id });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');
  }
  res.status(httpStatus.NO_CONTENT).send();
});
