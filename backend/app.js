const express = require('express')
const errorMiddleware =require('./middlewear/error')
const cookieParser = require('cookie-parser')


const app = express();

app.use(express.json())
app.use(cookieParser())

// Route imports
const product =require('./routes/productRoute')
const user = require('./routes/userRoutes')


app.use('/api/v1',product)
app.use('/api/v1',user)


//Middlewear for error
app.use(errorMiddleware)


module.exports = app