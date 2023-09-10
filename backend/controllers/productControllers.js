const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors= require('../middlewear/catchAsyncError')
const ApiFeatures = require('../utils/apifeatures')
//Create Product

exports.createProduct =catchAsyncErrors(async (req, res, next) => {
  req.body.user =req.user.id
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

exports.getAllProducts =catchAsyncErrors( async (req, res) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query);
  apiFeature.search().filter().pagination(resultPerPage);
  const product = await apiFeature.query;
  res.status(201).json({ success: true,productCount , product});
});

exports.getProductDetails =catchAsyncErrors(async(req,res,next)=>{
  const product = await Product.findById(req.params.id)
   if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
 

    return res.status(200).json({
      success: true,
      product,
    });
})
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
