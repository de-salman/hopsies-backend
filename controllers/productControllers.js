const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewear/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const querystring = require('querystring');
//Create Product


exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body)
  const {
    sku,
    name,
    price,
    discount,
    offerEnd,
    new: isNew,
    rating,
    saleCount,
    category,
    tag,
    variation,
    images,
    shortDescription,
    fullDescription,
  } = req.body;

  // Upload product images
  const productImages = await Promise.all(
    images.map(async (image) => {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });

      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    })
  );

  // Upload variation images
  const variationImages = await Promise.all(
    variation.map(async (v) => {
      if (v.image) {
        const result = await cloudinary.v2.uploader.upload(v.image, {
          folder: "products",
        });

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }
      return null;
    })
  );

  // Create product with uploaded images
  const product = await Product.create({
    sku,
    name,
    price,
    discount,
    offerEnd,
    new: isNew,
    rating,
    saleCount,
    category,
    tag,
    variation: variation.map((v, index) => ({
      color: v.color,
      image: variationImages[index], // Use the corresponding variation image
      size: v.size.map((s) => ({
        name: s.name,
        stock: s.stock,
      })),
    })),
    images: productImages,
    shortDescription,
    fullDescription,
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    product,
  });
});


exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 10;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query);
  apiFeature.search().filter().pagination(resultPerPage);
  const product = await apiFeature.query;
  res.status(201).json({ success: true, productCount, product });
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    updatedProduct,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.deleteOne();
  return res.status(200).json({
    success: true,
    message: "product Deleted Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId)
  if(product){
    console.log(product,productId,'product')

  }

  

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
