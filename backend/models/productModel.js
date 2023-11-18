const mongoose = require("mongoose");

const sizeSchema = new Schema({
  name: String,
  stock: Number,
});

const variationSchema = new Schema({
  color: String,
  image: String,
  size: [sizeSchema],
});

const productSchema = mongoose.Schema({
  sku: {
    type: String,
    required: [true, "Please enter SKU"],
  },
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  discount: {
    type: Number,
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  offerEnd: {
    type: Date,
  },
  new: {
    type: Boolean,
    default: false,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  saleCount: {
    type: Number,
    default: 0,
  },
  category: {
    type: Array,
    required: [true, "Please Enter Product Category"],
  },
  tag: {
    type: Array,
    required: [true, "Please Enter Product Category"],
  },
  variation: [variationSchema],
  images: {
    type: Array,
    required: true,
  },
  stock: {
    type: Number,
    required: [true, "Plase Enter Product Stock"],
    maxLength: [4, "Its cannot exceed 4 characters"],
    default: 1,
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
  shortDescription: {
    type: String,
    required: [true, "please Enter product Short Description"],
  },
  fullDescription: {
    type: String,
    required: [true, "please Enter product Full Description"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
