const mongoose = require('mongoose')

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{useUnifiedTopology:true}).then((data)=>{
        console.log(`MongoDb connceted with server: ${data.connection.host}`);
    })
}

module.exports=connectDatabase