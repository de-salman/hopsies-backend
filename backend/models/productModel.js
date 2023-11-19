const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  sku: {
    type: String,
    required: [true, 'Please enter product SKU'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
  },
  discount: {
    type: Number,
    default: 0,
  },
  offerEnd: {
    type: Date,
  },
  new: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  saleCount: {
    type: Number,
    default: 0,
  },
  category: {
    type: [String],
    required: [true, 'Please enter product category'],
  },
  tag: {
    type: [String],
  },
  variation: [
    {
      color: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      size: [
        {
          name: {
            type: String,
            required: true,
          },
          stock: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  shortDescription: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
