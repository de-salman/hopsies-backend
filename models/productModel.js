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
  image: {
    type: [String],
  },
  variation: [
    {
      color: {
        type: String,
        // required: true,
      },
      image: {
        public_id: {
          type: String,
          // required: true,
        },
        url: {
          type: String,
          // required: true,
        },
      },
      size: [
        {
          name: {
            type: String,
            // required: true,
          },
          stock: {
            type: String,
            // required: true,
          },
        },
      ],
    },
  ],
  images: [
    {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
  ],
  shortDescription: {
    type: String,
  },
  fullDescription: {
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
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);
