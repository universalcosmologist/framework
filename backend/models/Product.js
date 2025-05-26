const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
   title:{
     type:String,
     required:true,
   },
   price:{
    type:Number,
    required:true,
    min:0,
   },
   description:{
    type:String,
    required:true,
   },
   category:{
    type:String,
    required:true,
   },
   image_url:{
    type:String,
    required:true,
   },
   rating: {
    type: {
      rate: { type: Number, default: 0 , min:0 , max:5 }, 
      count: { type: Number, default: 0 , min:0}, 
    },
    default: { rate: 0, count: 0 },
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},{timestamps:true});

const Product=mongoose.model('Product',productSchema);

module.exports=Product;
