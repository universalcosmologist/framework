const express=require('express');
const router=express.Router();
require('dotenv').config();
const {S3Client,PutObjectCommand}=require('@aws-sdk/client-s3')
const {getSignedUrl}=require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});


router.get('/generate_url',async(req,res)=>{
    console.log("hello i have reached image upload");
    const {fileName,fileType}=req.query;
    const bucket_name=process.env.AWS_S3_BUCKET_NAME;
    if(!fileName || !fileType){
        return res.status(400).json({message:'file name and file type are missing'});
    }
    try {
        const key=`uploads/${Date.now()}/${fileName}`;
        const params={
            Bucket:bucket_name,
            Key:key,
            ContentType:fileType,
        };
        const command=new PutObjectCommand(params);
        const uploadUrl=await getSignedUrl(s3,command,{expiresIn:3600});
        const fileUrl = `https://${bucket_name}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return res.json({uploadUrl,fileUrl});
    } catch (error) {
        return res.status(500).json({error:"failed to generate pre-signed url"});
    }
})

module.exports=router;