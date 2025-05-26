import React,{useState} from 'react'
import { addMessage,hideMessage } from '../Slices/alertSlice'; 
import {  useDispatch } from 'react-redux';
//we have to make quantity editable
//set a sort of form so that small updates are not send to backend only when user clicks on button then send reuest to backend
//now remove feature is left
function Cart_component({cart_item,onRefresh}) {
  const [quantity,setQuantity]=useState(1);
  const token=localStorage.getItem('token');
  const dispatch=useDispatch();

  const handleDelete=async()=>{
    if(token){
      try {
        const response=await fetch(`http://localhost:8000/cart/delete/${cart_item._id}`,{
          method:"DELETE",
          headers:{
            'Authorization':`Bearer ${token}`,
          }
        });
        const ans=await response.json();
        console.log(ans);
        onRefresh();
      } catch (error) {
        console.log('error occured while deleting item in handleDelete',error);
      }
    }
  }

  const handleUpdate=async()=>{
     if(!quantity || quantity<=0){
        show_notification('enter valid quantity');
        return;
     }
     if(token){
       try {

        const response=await fetch(`http://localhost:8000/cart/update/${cart_item._id}`,{
          method:'PATCH',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({quantity}),
        });
        const ans=await response.json();
        console.log(ans);
        onRefresh();

       } catch (error) {
        
        console.log('error occured while updating quantity in handleUpdate',error);

       }

     }
  }

  const show_notification=(message)=>{
      dispatch(addMessage(message));
      setTimeout(()=>{
        dispatch(hideMessage());
      },2000);
  }

  return (
    <div className="relative bg-gray-800 text-white w-72 m-4 p-4 rounded-xl shadow-lg">
    <button
      onClick={handleDelete}
      className="absolute top-2 right-2 bg-red-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
      title="Remove item"
    >
      ×
    </button>
  
    <div className="text-sm text-gray-400 mb-2">
      <span className="inline-block bg-red-600 text-white px-2 py-1 rounded">
        ID: {cart_item._id}
      </span>
    </div>
  
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-yellow-300">
        {cart_item?.product?.title ?? "Item does not have a title"}
      </h2>
    </div>
  
    <div className="mb-3">
      <p className="text-md">
        Price: <span className="text-green-400 font-medium">
          ₹{cart_item?.product?.price ?? -1}
        </span>
      </p>
    </div>
  
    <div className="mb-3">
      <p className="text-md">
        Quantity: <span className="text-blue-400 font-medium">
          {cart_item?.quantity ?? 1}
        </span>
      </p>
    </div>
  
    <div className="mb-3">
      <p className="text-md">
        Update Quantity:
        <input 
          type='number' 
          className='ml-2 w-16 px-2 py-1 rounded text-black'
          min={1} 
          max={100}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </p>
    </div>
  
    <div className="mb-3">
      <button
        onClick={handleUpdate}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1 rounded"
      >
        Update
      </button>
    </div>
  </div>
  
  
  )
}

export default Cart_component