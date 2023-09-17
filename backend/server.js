const app = require('./app')
const dotenv =require('dotenv')
const connectDatabase=require('./config/database')
const cloudinary = require('cloudinary')

// Config
dotenv.config({path:'backend/config/.env'})


// Connecting Database
connectDatabase()

// Handling Uncaught Exception
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1)
    })
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const server=  app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is woorking on http://localhost:${process.env.PORT}`)
    // res.status(200).json({message:'ok'})
})

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

process.on('unhandledRejection',err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.getMaxListeners(1)
    })
})





