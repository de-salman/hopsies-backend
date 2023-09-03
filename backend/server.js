const app = require('./app')
const dotenv =require('dotenv')
const connectDatabase=require('./config/database')

// Config
dotenv.config({path:'backend/config/.env'})


// Connecting Database
connectDatabase()


app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is woorking on http://localhost:${process.env.PORT}`)
    // res.status(200).json({message:'ok'})
})

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});






