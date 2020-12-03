const asyncHandler = require('express-async-handler');
const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * @route   /api/v1/products
 * @method  POST
 * @desc    Create a new product
 * @access  private
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const { title, subtitle, description, price } = req.body;
  const product = await Product.create({ title, subtitle, description, price });
  res.status(httpStatus.CREATED).json({ product });
});

/**
 * @route   /api/v1/products
 * @method  GET
 * @desc    Get products
 * @access  public
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json({ products });
});

/**
 * @route   /api/v1/products/:product
 * @method  GET
 * @desc    Get product
 * @access  public
 */
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.product);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
  }
  res.json({ product });
});

/**
 * @route   /api/v1/products/:product
 * @method  PATCH
 * @desc    Update product
 * @access  private
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  const { title, subtitle, description, price } = req.body;
  const updateBody = { title, subtitle, description, price };
  const product = await Product.findById(req.params.product);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
  }
  Object.assign(product, updateBody);
  await product.save();
  res.json({ product });
});

/**
 * @route   /api/v1/products/:product
 * @method  DELETE
 * @desc    Delete product
 * @access  private
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.product);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found.');
  }
  res.status(httpStatus.NO_CONTENT).send();
});
