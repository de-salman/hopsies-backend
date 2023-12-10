const express = require("express");
const router = express.Router();
const { processPayment, sendStripeApiKey, paymentVerification, checkout } = require("../controllers/paymentControllers");
const { isAuthenticatedUser } = require("../middlewear/auth");
// const { checkout } = require("./productRoute");

// router.route("/payment/process").post(isAuthenticatedUser, processPayment);

// router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

// router.route("/checkout").post(checkout);

// router.route("/paymentverification/:id").post(paymentVerification);

module.exports = router;
