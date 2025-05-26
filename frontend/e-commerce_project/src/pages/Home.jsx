// and now it needs changes we need to fetch everytime from db and then display it 
// lets move that is_logged to global so that other functions can also use it
import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductContext } from "../../contexts/ProductContext";

function Home() {
  const [product,setProduct]=useState(null);
  const {data}=useProductContext();
  const navigate=useNavigate();
 
  const category_list=["men's clothing","women's clothing","electronics","jewellery"];
  useEffect(()=>{
    console.log(data);
    setProduct(data);
  },[data]);

  const handleCategoryDisplay=(category)=>{
    navigate('/productcategory',{state:{product,category}});
  }
  //display by category so make category cards and on click send to different page with category name and all the products
  //and do filter there
  if(!product){
    return (
      <div className="h-[160px] bg-black flex flex-col items-center justify-center text-white">
      <div className="text-2xl font-semibold mb-4">Please login to view products</div>
      <Link
        to="/login"
        className="bg-white text-black px-6 py-2 rounded-lg shadow hover:bg-gray-200 transition-all duration-200"
      >
        Click here to login
      </Link>
      </div>
    );
  }

  return (
   <div className="flex flex-wrap gap-4 p-4">
  {product && category_list && category_list.map((category) => (
    <div
      key={category}
      className="border border-gray-300 rounded-lg p-6 w-60 flex flex-col items-center justify-between shadow-sm bg-white hover:shadow-md transition"
    >
      <h2 className="text-xl font-bold capitalize text-blue-600 mb-4">
        {category}
      </h2>
      <button
        onClick={() => handleCategoryDisplay(category)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Explore Products
      </button>
    </div>
    ))}
   </div>
  )
}

export default Home