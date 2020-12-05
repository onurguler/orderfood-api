const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { Cart, Product } = require('../database');
const ApiError = require('../utils/ApiError');

/**
 * @route   /api/v1/cart
 * @method  PUT
 * @desc    Add product to cart
 * @access  private
 */
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
  }

  const [cart] = await Cart.findOrCreate({
    where: { userId: req.user.id },
    include: {
      model: Product,
      as: 'items',
      through: {
        as: 'cartItem',
        attributes: ['quantity'],
      },
    },
  });

  const cartProducts = await cart.getItems({ where: { id: productId } });

  let newQuantity = quantity;

  if (cartProducts.length > 0) {
    newQuantity += cartProducts[0].CartItem.quantity;
  }

  await cart.addItem(product, { through: { quantity: newQuantity } });

  const message = newQuantity !== quantity ? 'updated' : 'added';

  res.json({ message, cart, product, quantity: newQuantity });
});

/**
 * @route   /api/v1/cart
 * @method  PATCH
 * @desc    Update product quantity in cart
 * @access  private
 */
exports.updateProductQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await req.user.getCart();

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty.');
  }

  const cartProducts = await cart.getItems({ where: { id: productId } });

  if (cartProducts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found in your cart.');
  }

  // TODO: if quantity is 0, delete product from cart

  const cartItem = cartProducts[0].CartItem;

  cartItem.quantity = quantity;

  await cartItem.save();

  res.json({ cart, productId, quantity });
});

/**
 * @route   /api/v1/cart/remove
 * @method  PUT
 * @desc    Update product quantity in cart
 * @access  private
 */
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const cart = await req.user.getCart();

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty.');
  }

  const rows = await cart.removeItem(productId);

  if (rows === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found in your cart.');
  }

  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @route   /api/v1/cart
 * @method  DELETE
 * @desc    Empty cart
 * @access  private
 */
exports.emptyCart = asyncHandler(async (req, res) => {
  const cart = await req.user.getCart({ include: { model: Product, as: 'items' } });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is already empty.');
  }
  await cart.setItems([]);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * @route   /api/v1/cart
 * @method  GET
 * @desc    Get cart
 * @access  private
 */
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({
    where: { userId: req.user.id },
    include: {
      model: Product,
      as: 'items',
      through: {
        as: 'cartItem',
        attributes: ['quantity'],
      },
    },
  });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Your cart is empty.');
  }
  res.json({ cart });
});
