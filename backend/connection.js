const mongoose=require('mongoose');

const connectDB=async()=>{
   try {
    await  mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');
    console.log('mongodb connected');
   } catch (error) {
    console.log('error occured while connecting to mongodb');
   }
};

module.exports=connectDB;