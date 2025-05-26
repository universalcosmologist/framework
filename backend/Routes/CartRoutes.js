const express=require('express');
const Cart=require('../models/Cart');
const router=express.Router();
//one route for getting all the products of a particular user(done)get
//this router needs to be secure 
//one for updating product(done) patch
//one for adding item in db(done) post
//one for checking if a product with given user id exists already in backend or not
//one for deleting the product is left (done) delete

router.route('/')
.get(async(req,res)=>{
   try {
    
    const user_id=req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const items=await Cart.find({user:`${user_id}`}).populate('product');
    return res.json({items});

   } catch (error) {

     console.log("error occured while fetching for items",error);
     return res.status(500).json({error:"error occured while fetching for items"});

   }
})
.post(async(req,res)=>{
    try {

        const user_id=req.user?.user_id;

        if (!user_id) {
          return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        
        const {product_id}=req.body;

        if(!product_id){
            return res.status(400).json({error:"product id is needed"});
        }

        const item=await Cart.create({product:product_id,user:user_id,quantity:1});

        return res.json({item});

        
    } catch (error) {

     console.log("error occured while adding item in db",error);
     return res.status(500).json({error:"error occured while adding item in db"}); 
        
    }
});

router.route('/update/:id')
.patch(async(req,res)=>{
   try {

    const user_id=req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const {id}=req.params;

    if(!id){
        return res.status(400).json({error:"cart item id is needed"});
    }
    const {quantity}=req.body;

    if(!quantity){
      return res.status(400).json({error:"quantity for update is needed"});
    }

    const updated_product=await Cart.findByIdAndUpdate(
       id,
       req.body,
       {new:true},
    );

    return res.json({updated_product});
    
   } catch (error) {

    console.log("error occured while updating item in db",error);
    return res.status(500).json({error:"error occured while updating item in db"}); 
    
   }
});

router.route('/check')
.get(async(req,res)=>{
   try {

    const user_id=req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const { product_id }=req.query;

    if(!product_id){
      return res.status(400).json({error:"product id is needed for check"});
    }

    const item=await Cart.findOne({user:user_id,product:product_id});

    const isPresent=(item==null) ? false : true;

    return res.json({isPresent});

   } catch (error) {

     console.log("error occured in backend in /cart/check route",error);
     return res.status(500).json({error:"error occured in backend in /cart/check route"});

   }
});

router.route('/delete/:id')
.delete(async(req,res)=>{
  try {

    const user_id=req.user?.user_id;

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const {id}=req.params;

    if(!id){
        return res.status(400).json({error:"cart item id is needed"});
    }

    const deleted_product=await Cart.findByIdAndDelete(id);

    if(!deleted_product){
      return res.status(404).json({error:"cannot find product"});
    }

    return res.status(200).json({deleted_product});
    
   } catch (error) {

    console.log("error occured while deleting item in db",error);
    return res.status(500).json({error:"error occured while deleting item in db"}); 
    
   }
})

module.exports=router;
