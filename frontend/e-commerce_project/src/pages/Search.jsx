import React from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from '../Components/Product_Card';
// this will display all the searched products using search bar and diversion will lead to this page

function Search() {
  const location=useLocation();
  const {matched_products}=location.state || {};
  if(matched_products && matched_products.length>0){
    return (
        <div>
            <span className='text-white text-3xl'>Here are your search results : </span>
            <ul>
                {matched_products.map((cur_product)=>(
                    <ProductCard key={cur_product._id} product={cur_product}/>
                ))}
            </ul>
        </div>
    )
  }else{
    return <div className='text-white text-3xl'>No Valid Result For The Search</div>
  }
}

export default Search