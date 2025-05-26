require('dotenv').config();
//define static routes above dynamic routes
const express=require('express');
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const router=express.Router();
const {authMiddleware}=require('../middlewares/authMiddleware')
//const {authMiddleware}=require('../middlewares/authMiddleware')

const jwt_secret=process.env.JWT_SECRET;

router.route('/')
.get(async(req,res)=>{
    try {
      const users=await User.find();
      return res.json(users);  
    } catch (error) {
      return res.status(500).json({error:"error message"});
    }
})
.post(async(req,res)=>{
    if(!req || !req.body || !req.body.name || !req.body.email || !req.body.password || !req.body.role || !req.body.phone){
      return res.status(400).json({error:"provide all the required fields"});
    }else{
      try {
        const new_user=await User.create(req.body);
        return res.status(201).json({msg:"user created successfully",user:new_user._id});
      } catch (error) {
        return res.status(400).json({error:"user is not created"});
      }
    }
});

router.get('/profile',authMiddleware,async(req,res)=>{
   const user_id=req.user?.user_id;
   console.log("reached profile endpoint");
  if (!user_id) {
    console.log("no user id");
    return res.status(401).json({ error: "Unauthorized: User not found" });
  }
   console.log(user_id);
   try { 
    console.log("inside try");
    const user=await User.findById(user_id);
    console.log(user);
    return res.status(200).json({user});
   } catch (error) {
    console.log("inside error of profile");
    return res.status(500).json({error:"error in getting user from db",error});
  }
});

router.post('/login',async(req,res)=>{
  try {
    if(!req.body || !req.body.email || !req.body.password){
     return res.status(400).json({error:"provide both the fields"});
    }
    const email=req.body?.email;
    const password=req.body?.password;
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"user not found"});
    }
    const match=await bcrypt.compare(password,user.password);
    if(!match){
      return res.status(400).json({error:"incorrect password"});
    }
    const token=jwt.sign({user_id:user._id,email:user.email},jwt_secret);
    return res.json({message:"login successful",token,userID:user._id});
  } catch (error) {
    return res.status(500).json({error:"error on server side for finding user in db"});
  }
});

router.route('/:id')
.get(async(req,res)=>{
    try {
      const UserId=req.params.id;
      if(!UserId){
        return res.status(404).json({message:"provide valid id in params error occured in route /users/:id"});
      }
      const user=await User.findById(UserId);
 
      if(!user){
        return res.status(404).json({message:"user not found"});
      }

     return  res.status(200).json(user);

    } catch (error) {
      res.status(500).json({message:"server error"});
    }
})
.delete(async(req,res)=>{
    try {
      const userId=req.params.id;
      const deleted_user=await User.findByIdAndDelete(userId);
      if(deleted_user){
       return res.json({msg:"user deleted"});
      }else{
       return res.json({msg:"user not found"});
      }
    } catch (error) {
        res.json({error:"error occured while deleting user"});
    }
});

module.exports=router;

