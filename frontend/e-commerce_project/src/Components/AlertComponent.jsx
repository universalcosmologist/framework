import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { hideMessage } from '../Slices/alertSlice';

function AlertComponent() {
 const dispatch=useDispatch();
 const message=useSelector((state)=>state.alerts.message);
  if(!message || message=="") return null;
  else{
    return(
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-black text-white p-3 rounded shadow-lg">
      {message}
      <button className="ml-3 text-red-400" onClick={() => dispatch(hideMessage())}>
        ✖
      </button>
     </div>
    )
  }
}

export default AlertComponent