import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { addMessage,hideMessage } from "../Slices/alertSlice";
import {  useDispatch } from 'react-redux';
import { useProductContext } from '../../contexts/ProductContext';

function Login() {
  const navigate=useNavigate();
  const {setFresh}=useProductContext();
  const dispatch=useDispatch();
  const [formData,setFormData]=useState({
    email:"",
    password:"",
  })
  const show_notification=(message)=>{
    dispatch(addMessage(message));
    setTimeout(()=>{
      dispatch(hideMessage());
    },2000);
  }
  const handleLogin=async(event)=>{
    event.preventDefault();
    if(!formData || !formData.email || !formData.password){
      console.log("field should not be empty");
      return;
    }
    const urlEncodedData=new URLSearchParams(formData).toString();
    try {
      const response=await fetch('http://localhost:8000/users/login',{
        method:"POST",
        headers:{
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body:urlEncodedData,
      });
      const data=await response.json();
      if(data.message){
        localStorage.setItem("token",data.token);
        show_notification("login successful");
        setFresh(false);
        setTimeout(()=>{
          navigate('/');
        },100)
      }else{
        show_notification("login failed");
        if(data.error) console.log(data.error);
      }
    } catch (error) {
      console.log("error occured while fetch in frontend");
    }

  }
  const handleEmailChange=(e)=>{
     const email=e.target.value;
     setFormData({...formData,email});
  }
  const handlePasswordChange=(e)=>{
    const password=e.target.value;
    setFormData({...formData,password});
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Log In</h2>
        <form>
          <div className="mb-3">
            <label className="block text-gray-600">Email</label>
            <input 
              type="email" 
              name="email" 
              className="w-full p-2 border rounded-lg" 
              value={formData.email}
              onChange={handleEmailChange}
              required 
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-600">Password</label>
            <input 
              type="password" 
              name="password" 
              className="w-full p-2 border rounded-lg" 
              value={formData.password}
              onChange={handlePasswordChange}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleLogin}
            >
            Submit
          </button>
        </form>
        <div className='p-2'>
        <span id="label-for-button" className=''>Don't have a account,click here to Signup</span>
        <button aria-labelledby="label-for-button" className='bg-blue-500 text-white m-4 p-3 rounded-lg' onClick={()=>navigate('/signup')}>SignUp</button>
       </div>
      </div>
    </div>
  )
}

export default Login