const mongoose = require('mongoose');

const connectDB = async () => {
try {
   const mongoUri = process.env.MONGO_URI; 
   if (!mongoUri) throw new Error("MONGO_URI not set in environment");

await mongoose.connect(mongoUri);
   console.log('MongoDB connected');
} catch (error) {
   console.error('Error occurred while connecting to MongoDB:', error);
}
};

module.exports = connectDB;
