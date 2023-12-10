const express = require('express')
const errorMiddleware =require('./middlewear/error')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors');
const dotenv = require("dotenv");

// Config
dotenv.config({ path: ".env" });


const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())


const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
    credentials: true,
  };
  
  app.use(cors(corsOptions));

// Route imports
const product =require('./routes/productRoute')
const user = require('./routes/userRoutes')
const order = require('./routes/orderRoute')
const payment = require('./routes/paymentRouter')


app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);




// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });



//Middlewear for error
app.use(errorMiddleware)


module.exports = app