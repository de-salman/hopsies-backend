const express = require('express')
const errorMiddleware =require('./middlewear/error')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors');


const app = express();

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


app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)



// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });



//Middlewear for error
app.use(errorMiddleware)


module.exports = app