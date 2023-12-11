const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewear/catchAsyncError");
const Razorpay = require("razorpay");
const crypto = require("crypto");
// Create new Order
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo: {
      // Use the _id after the order has been created
      id: null, // You can set it to null initially
      status: 'pending',
    },
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  
  order.paymentInfo.id = order._id;


  const options = {
    amount: order.totalPrice * 100,
    currency: "INR",
    receipt: order._id.toString(), // Use order ID as the receipt
    payment_capture: 1,
  };
  try {
    const razorpayOrder = await instance.orders.create(options);
    order.paymentInfo.razorpay_order_id = razorpayOrder.id;
    await order.save();
    // console.log(order);
    res.status(201).json({
      success: true,
      order,
      razorpayOrder,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
  }

});


// Your existing route for payment verification
exports.paymentVerification = async (req, res) => {
  console.log(req.body,'request')
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;



  const order = await Order.findOne({
    'paymentInfo.razorpay_order_id': razorpay_order_id,
    // 'paymentInfo.id': order._id, // Assuming the payment ID is the order ID
  });
 
  if (!order) {
    return res.status(400).json({
      success: false,
      message: 'Order not found',
    });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update the order with Razorpay payment details
    order.paymentInfo.razorpay_payment_id = razorpay_payment_id;
    order.paymentInfo.status = 'success'; // or any status you prefer
    console.log(order,'orders')
    await order.save();
    res.status(201).json({
      success: true,
     
    });

    // res.redirect(
    //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    // );
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid signature',
    });
  }
};
// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});
