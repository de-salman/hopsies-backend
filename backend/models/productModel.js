const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter product name'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'please Enter product Description']
    },
    price:{
        type:Number,
        required:[true,'Please Enter Product Price'],
        maxLength:[8,'Price cannot exceed 8 characters']
    },
    rating:{
        type:Number,
        default:0
    },
    image:[{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,'Please Enter Product Category'],
    },
    Stock:{
        type:Number,
        required:[true,'Plase Enter Product Stock'],
        maxLength:[4,'Its cannot exceed 4 characters'],
        default:1
    },
    numOfReview:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }        
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    
})

module.exports = mongoose.model('Product',productSchema)