import React from 'react'
import { useLocation } from 'react-router-dom'
import ProductCard from '../Components/Product_Card';

function ProductCategory() {
  const location=useLocation();
  const {category,product}=location.state || {};
  if (!category || !Array.isArray(product)) {
    return <div className='text-white'>No products to display</div>;
  }
  const filtered_products=product.filter((product)=>product.category==category);
  //do just filerting based on category now
  if(category){
       return (
       <div className='text-white'>
        {filtered_products && filtered_products.map((product)=>(
          <ProductCard key={product._id} product={product}/>
        ))}
       </div>
      )
  }else{ 
      return <div className='text-white'>error detected</div>
  }
}

export default ProductCategory