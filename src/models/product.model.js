const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    description: String,
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
