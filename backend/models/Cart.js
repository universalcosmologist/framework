const mongoose =require('mongoose');

const cartSchema=new mongoose.Schema({
   product:{
     type: mongoose.Schema.Types.ObjectId,
     ref:"Product",
     required:true,
   },
   user:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:true,
   },
   quantity:{
     type:Number,
     required:true,
   },
},{timestamps:true});

const Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;