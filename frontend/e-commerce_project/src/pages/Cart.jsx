import React, { useEffect } from 'react'
import Cart_component from '../Components/Cart_component';

function Cart() {
  const [cart_items,setCart_items]=React.useState(null);
  const [total_cart_price,setTotal_cart_price]=React.useState(0);
  const token=localStorage.getItem('token');

  const fetch_item=async()=>{
    if(token){
      try {

        const res=await fetch('http://localhost:8000/cart',{
          method:"GET",
          headers:{
          'Authorization':`Bearer ${token}`,
          },
        });
        const response=await res.json();
        const {items}=response;
        if(items) setCart_items(items);
        
      } catch (error) {

        console.log("error occured while fetching cart items",error);
        
      }
    }else{
      setCart_items(null);
    }
  }

  useEffect(()=>{
    fetch_item();
  },[]);

  useEffect(()=>{
    if(cart_items && Array.isArray(cart_items)){
      const price=cart_items.reduce((sum,item)=>{
        return (sum+((item.product.price ?? 0)*(item.quantity ?? 1)))
      },0);
      setTotal_cart_price(parseFloat(price.toFixed(2)));
    }
  },[cart_items]);

  if(!cart_items){
    return (
      <div className='text-gray-800 text-xl'>Login to view your Cart</div>
    )
  }
  return (
  <div>
    <div>
        {cart_items && cart_items.map((cart_item,index)=>
            <Cart_component key={index} cart_item={cart_item} onRefresh={fetch_item}/>
        )}
    </div>
    {(cart_items.length>0 && total_cart_price>0) ?  <p className='text-xl text-gray-800'>Total Amount To Pay: {total_cart_price}</p> : <p></p>}
    {cart_items.length==0 && <p className='text-gray-800 text-2xl'>Wow! such empty</p>}
  </div>
  )

}

export default Cart