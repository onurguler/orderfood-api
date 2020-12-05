const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, maxlength: 32, required: true },
    text: { type: String, required: true },
    directionsTo: { type: String },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [long, lat]
    },
    isDeliveryAddress: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
addressSchema.plugin(toJSON);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
