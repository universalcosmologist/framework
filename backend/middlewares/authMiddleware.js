const jwt=require('jsonwebtoken');

const authMiddleware=(req,res,next)=>{
    console.log("hello i have reached middleware");
    const authHeader=req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({no_header:"give authorization header"});
    }
    const token=authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({login_required_message:"login is required"});
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.json({invalid_token_message:"invalid token"});
        }
        req.user=user;
        next();
    });
}

module.exports={authMiddleware};