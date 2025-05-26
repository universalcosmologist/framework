const express=require('express');
const Product=require('../models/Product');
const router=express.Router();

router.route('/')
.get(async(req,res)=>{
    try {
      const products=await Product.find(); 
      return res.json({products});
    } catch (error) {
      return res.status(500).json({error:"error while extracting products"});
    }
})
.post(async(req,res)=>{
   //isme ham product ko db me daalenge
   console.log("hello i have reached product creation");
    try {
      const user_id=req.user?.user_id;

      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }
  
     const product_body=req.body;
     const product=await Product.create({...product_body,added_by:`${user_id}`});
      return res.json({product});
    } catch (error) {
      console.log("error occured while adding product",error);
      return res.status(500).json({error:"error while adding new product"});
    }
});

router.route('/update')
.patch(async(req,res)=>{
      const user_id=req.user?.user_id;

      if (!user_id) {
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }

      const {title,des,numeric_price,category,product}=req.body;
      if(!product){
        return res.status(400).json({error:"product is needed"});
      }
      let updateFields={};
      if (typeof title === "string" && title.trim() !== "") {
        updateFields.title = title.trim();
      }
      if (typeof des === "string" && des.trim() !== "") {
        updateFields.description = des.trim();
      }
      if (typeof numeric_price === "number" && numeric_price>0) {
        updateFields.price = numeric_price;
      }
      if (typeof category === "string" && category.trim()!=="") {
        updateFields.category = category;
      }
      const id_of_adder=product?.added_by;
      if(id_of_adder.toString() !== user_id.toString()){
        return res.json({error:"You are not allowed to edit this product"});
      }
      try{
       const updated_product=await Product.findByIdAndUpdate(
        product._id,
        {$set:updateFields},
       {new:true},
      );
       if(!updated_product){
        return res.status(404).json({error:"product not found or error occured"});
       }
       return res.json({updated_product});
   } catch (error) {
      console.log("error occured while updating product",error);
      return res.status(500).json({error:"error while updating product"});
   }
});

module.exports=router;

