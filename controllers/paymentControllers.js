// const Razorpay = require("razorpay");
// const catchAsyncError = require("../middlewear/catchAsyncError");
// // import {instance} from '../server.js'

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// exports.processPayment = catchAsyncError(async (req, res, next) => {
//   const myPayment = await stripe.paymentIntents.create({
//     amount: req.body.amount,
//     currency: "inr",
//     metadata: {
//       company: "Ecommerce",
//     },
//   });

//   res
//     .status(200)
//     .json({ success: true, client_secret: myPayment.client_secret });
// });

// exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
//   res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
// });




// exports.checkout = async (req, res) => {
//   const options = {
//     amount: Number(req.body.amount * 100),
//     currency: "INR",
//   };
//   const order = await instance.orders.create(options);

//   res.status(200).json({
//     success: true,
//     order,
//   });
// };

// exports.paymentVerification = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     // Database comes here

//     await Payment.create({
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     });

//     res.redirect(
//       `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
//     );
//   } else {
//     res.status(400).json({
//       success: false,
//     });
//   }
// };


