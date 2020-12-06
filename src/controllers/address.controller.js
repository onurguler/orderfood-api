const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { Address, sequelize } = require('../database');
const ApiError = require('../utils/ApiError');

/**
 * @route   /api/v1/addresses
 * @method  POST
 * @desc    Create a new address
 * @access  private
 */
exports.createAddress = asyncHandler(async (req, res) => {
  const { title, address, address2, district, postalCode, phone, directionsTo, markPreferredAddress } = req.body;

  const createBody = {
    userId: req.user.id,
    title,
    address,
    address2,
    district,
    postalCode,
    phone,
    directionsTo,
  };

  let result;

  if (!markPreferredAddress) {
    const addressDoc = await Address.create(createBody);
    result = { address: addressDoc };
  } else {
    try {
      result = await sequelize.transaction(async (t) => {
        const addressDoc = await Address.create(createBody, { transaction: t });
        const user = await req.user.update({ preferredAddressId: addressDoc.id }, { transaction: t });
        user.password = undefined;
        return { address: addressDoc, user };
      });
    } catch (error) {
      throw new Error();
    }
  }

  res.status(httpStatus.CREATED).json(result);
});

/**
 * @route   /api/v1/addresses
 * @method  GET
 * @desc    Get my addresses
 * @access  private
 */
exports.getMyAdresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findAll({ where: { userId: req.user.id } });
  res.json({ addresses });
});

/**
 * @route   /api/v1/addresses/preferred
 * @method  GET
 * @desc    Get my preferred address
 * @access  private
 */
exports.getMyPreferredAddress = asyncHandler(async (req, res) => {
  if (!req.user.preferredAddressId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Preferred address not found!');
  }

  const address = await Address.findByPk(req.user.preferredAddressId);

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Preferred address not found!');
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
  const address = await Address.findOne({ where: { id: req.params.address, userId: req.user.id } });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Delivery address not found!');
  }
  res.json({ address });
});

/**
 * @route   /api/v1/addresses/:address/mark-as-preferred
 * @method  PUT
 * @desc    Mark as delivery address
 * @access  private
 */
exports.markAsPreferredAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ where: { id: req.params.address, userId: req.user.id } });

  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');
  }

  if (req.user.preferredAddressId === address.id) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Your preferred address is already setted this address.');
  }

  const user = await req.user.update({ preferredAddressId: address.id });

  user.password = undefined;

  res.json({ user, preferredAddressId: address.id });
});

/**
 * @route   /api/v1/addresses/:address
 * @method  PATCH
 * @desc    Update address
 * @access  private
 */
exports.updateAddress = asyncHandler(async (req, res) => {
  const { title, address, address2, district, postalCode, phone, directionsTo, markPreferredAddress } = req.body;

  const updateBody = {
    title,
    address,
    address2,
    district,
    postalCode,
    phone,
    directionsTo,
  };

  const addressDoc = await Address.findOne({ where: { id: req.params.address, userId: req.user.id } });

  if (!addressDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');
  }

  let result;

  if (!markPreferredAddress) {
    const updatedAddress = await addressDoc.update(updateBody);
    result = { address: updatedAddress };
  } else {
    try {
      result = await sequelize.transaction(async (t) => {
        const updatedAddress = await addressDoc.update(updateBody, { transaction: t });
        const user = await req.user.update({ preferredAddressId: addressDoc.id }, { transaction: t });
        user.password = undefined;
        return { address: updatedAddress, user };
      });
    } catch (error) {
      throw new Error();
    }
  }

  res.json(result);
});

/**
 * @route   /api/v1/addresses/:address
 * @method  DELETE
 * @desc    Mark as delivery address
 * @access  private
 */
exports.deleteAddress = asyncHandler(async (req, res) => {
  const rows = await Address.destroy({ where: { id: req.params.address, userId: req.user.id } });
  if (rows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');
  }
  res.status(httpStatus.NO_CONTENT).send();
});
