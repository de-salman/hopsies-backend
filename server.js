const app = require("./app");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");



// Connecting Database
const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, { useUnifiedTopology: true })
    .then((data) => {
      console.log(`MongoDb connceted with server: ${data.connection.host}`);
    });
};
connectDatabase();

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


const server = app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is woorking on http://localhost:${process.env.PORT}`);
  // res.status(200).json({message:'ok'})
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.getMaxListeners(1);
  });
});
