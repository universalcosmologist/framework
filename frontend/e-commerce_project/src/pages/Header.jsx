import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addMessage,hideMessage } from "../Slices/alertSlice";
import { useProductContext } from "../../contexts/ProductContext";
import {useDispatch} from 'react-redux';
import Button from '../Components/Button';

function Header() {
  const [products,setProducts]=useState(null);
  const {data,setFresh}=useProductContext();
  useEffect(()=>{
    setProducts(data);
  },[data]);
  //const products=useSelector((state)=>state.products.products);
  const navigate=useNavigate();
  const [input_title,setInput_Title]=useState("");
  const [loading,setLoading]=useState(false);
  const [selected_category,setSelected_Category]=useState("All");
  const token=localStorage.getItem("token");
  const dispatch=useDispatch();
  const show_notification=(message)=>{
    dispatch(addMessage(message));
    setTimeout(()=>{
      dispatch(hideMessage());
    },2000);
  }
  // extract all the unique categories out of the products
  // title of product and input_title if there is even single common letter then display that product
  // jo jo product select ho jaenge display them in product Card
  // sepration is on the basis of the spaces 
  const categories=["All","men's clothing","women's clothing","electronics","jewellery"];

  const check=(product_title,input_title)=>{
    const input_words=new Set(input_title.toLowerCase().split(/\s+/));
    const product_words=new Set(product_title.toLowerCase().split(/\s+/));
    // agar input ka ek bhi word product me hai to return true 
    for(let word of input_words){
      if(product_words.has(word)) return true;
    }
    return false;
  }

  const handle_home_page=()=>{
    navigate('/');
  }

  const handle_log_out=()=>{
    const token = localStorage.getItem('token');
    if(!token){
      show_notification("user already logged out");
      return;
    }else{
      localStorage.removeItem('token');
      show_notification("user logged out");
      setFresh(false);
      return;
    }
  }

  const takeToCart=()=>{
    navigate('/cart');
  }

  const handleViewProfile=()=>{
    navigate('/user');
  }

  const handleFilter=()=>{
    setLoading(true);
    setTimeout(()=>{
      let matched_products=products ?  products.filter((product)=>
        check(product.title,input_title) && ((product.category==selected_category) || (selected_category=='All'))
      ) : [];
      if(input_title=="") matched_products=[];
      console.log(matched_products);
      navigate('/search_product',{state:{matched_products}});
      setLoading(false);
    },500);
  }

  return (
    <>
    <div className='flex align-middle justify-center'>
      <div className='m-5'>
        <button
        className='bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition m-1'
        onClick={takeToCart}
        >View Cart</button>
      </div>
      <div className='m-5'>
        <select
        value={selected_category}
        onChange={(e)=>setSelected_Category(e.target.value)}>
         {categories.map((category,index)=>(
          <option key={index} value={category}>{category}</option>
         ))}
        </select>
        <input
         type="text" 
         placeholder="search product" 
         className="m-3"
         value={input_title} 
         onChange={(e)=>setInput_Title(e.target.value)}
         />
        <button className='bg-slate-500 text-white p-1 rounded-lg hover:bg-slate-600 transition m-0'
        onClick={handleFilter}>
          Search
        </button>
      </div>
     <div className='m-4'>
     <Link to="/login">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition m-3">
          Login
        </button>
      </Link>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse text-white"></div>
      )}
     </div>
    </div>
    <div>
     <Link to="/product">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition m-3">
          Create Product
        </button>
      </Link>
     </div>
     <div>
        <button 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition m-3"
        onClick={handle_log_out}>
          Log Out
        </button>
     </div>
     <div>
        <button 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition m-3"
        onClick={handle_home_page}>
          Home
        </button>
     </div>
     {token && <div>
      <Button onClick={handleViewProfile}>
        Profile
      </Button>
     </div>}
    </>
  );
}

export default Header;
