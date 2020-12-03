const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { Cart, Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * @route   /api/v1/cart
 * @method  PUT
 * @desc    Add product to cart
 * @access  private
 */
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user });
  }

  cart.items.push({ product, quantity });

  await cart.save();

  res.json({ cart });
});

/**
 * @route   /api/v1/cart
 * @method  PATCH
 * @desc    Update product quantity in cart
 * @access  private
 */
exports.updateProductQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty.');
  }

  const productIndex = cart.items.findIndex((item) => item.product.id.toString() === productId);

  if (productIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found in your cart.');
  }

  cart.items[productIndex].quantity = quantity;

  await cart.save();

  res.json({ cart });
});

/**
 * @route   /api/v1/cart/remove
 * @method  PATCH
 * @desc    Update product quantity in cart
 * @access  private
 */
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty.');
  }

  const productIndex = cart.items.findIndex((item) => item.product.id.toString() === productId);

  if (productIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found in your cart.');
  }

  cart.items.splice(productIndex, 1);

  await cart.save();

  res.json({ cart });
});

/**
 * @route   /api/v1/cart
 * @method  DELETE
 * @desc    Empty cart
 * @access  private
 */
exports.emptyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndRemove({ user: req.user.id });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is already empty.');
  }
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @route   /api/v1/cart
 * @method  GET
 * @desc    Get cart
 * @access  private
 */
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty.');
  }
  res.json({ cart });
});
