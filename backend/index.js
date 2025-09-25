const express=require('express');
const cors=require('cors');

const connectDB=require('./connection');
const userRoutes=require('./Routes/UserRoute');
const productRouter=require('./Routes/ProductRoutes');
const imageRouter=require('./Routes/ImageRoutes');
const cartRouter=require('./Routes/CartRoutes');

const {authMiddleware}=require('./middlewares/authMiddleware');

connectDB();


const app=express();

app.use(cors({
  origin: '*', 
    credentials: true,
   allowedHeaders: ['Content-Type', 'Authorization'], // ALLOW Authorization header
}));
  

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use('/products',authMiddleware,productRouter);

app.use('/users',userRoutes);

app.use('/image',authMiddleware,imageRouter);

app.use('/cart',authMiddleware,cartRouter);

const PORT=process.env.port || 8000;

app.use((err, req, res, next) => {
  console.error("Uncaught server error:", err.stack);
  res.status(500).json({ message: "Unhandled server error" });
});

app.listen(PORT,()=>console.log('server started'));