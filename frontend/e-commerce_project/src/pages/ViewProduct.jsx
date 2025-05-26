import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../Components/Button'
import { useProductContext } from '../../contexts/ProductContext';
//this page helps to modify the product add the ratings and all and check who can which product

function ViewProduct() {
  const location=useLocation();
  const {setFresh}=useProductContext();
  const token=localStorage.getItem('token');
  const [title,setTitle]=useState("");
  const [des,setDes]=useState("");
  const [category,setCategory]=useState("");
  const [price,setPrice]=useState("");
  const {product}=location.state || {};

  const category_list=["men's clothing","women's clothing","electronics","jewellery"];

  const handleEditProduct=async()=>{
    //only the seller which owns this product can edit this product
    if(token){
      //verify this guy added this product or not that will be done by the backend
      if(!category_list.includes(category)){
         console.log("category should be among the preset ones");
         return;
      }
      const numeric_price=Number(price);
      try {
        const response=await fetch(`http://localhost:8000/products/update`,{
        method:"PATCH",
        headers:{
           'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({des,numeric_price,title,category,product}),
      });
      const ans=await response.json();
      setFresh(false);
      console.log(ans);

      } catch (error) {
        
       console.log("error occured in handleEditProduct function",error);

      }
    }
  }
  if(!product){
    return (
        <div className='text-black text-lg'>
            No Product to display
        </div>
    )
  }
  return (
    <div>
        <div className='m-4'>
          <img 
          src={product.image_url}
          alt={product.title}
          className="w-full h-48 object-contain bg-white p-2 rounded-lg"
        />
        </div>
       <div  className='m-4'>
         <h2 className="text-lg font-bold mt-4 text-white">{product.title}</h2>
           <label className='m-2 text-white' htmlFor='title'>enter new Title:</label>
          <input
          type='text' 
          value={title}
          id="title"
          onChange={(e)=>setTitle(e.target.value)}
          />
       </div>
        <div  className='m-4'>
          <p className="text-gray-400 text-sm mt-2 m-2">{product.description}</p>
          <label className='m-2 text-white' htmlFor='des'>enter new description:</label>
          <input
          type='text' 
          value={des}
          id="des"
          onChange={(e)=>setDes(e.target.value)}
          />
        </div>
       <div  className='m-4'>
         <p className="text-yellow-400 font-semibold m-2">${product.price}</p>
           <label className='m-2 text-white' htmlFor='price'>enter new Price:</label>
          <input
          type='number' 
          value={price}
          id="price"
            onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
               setPrice("");
               return;
              }
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                 setPrice(value);
              }
              }}
          />
         </div>
        <div  className='m-4'>
          <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
            <label className='m-2 text-white' htmlFor='category'>enter new Category:</label>
          <input
          type='text' 
          value={category}
          id="category"
          onChange={(e)=>setCategory(e.target.value)}
          />
        </div>
        <div className='m-4'>
        <Button onClick={handleEditProduct}>
                Edit Product
            </Button>
        </div>
    </div>

  )
}

export default ViewProduct