import React,{useState} from 'react'

function Sign_Up() {
  const [formData,setFormData]=useState({
    name:"",
    email:"",
    password:"",
    phone:"",
    role:"",
  })

  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value,
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData || !formData.email || !formData.password || !formData.name || !formData.role || !formData.phone){
      return;
    }
    const value=formData.phone;
    if (!/^\d*$/.test(value)) return; 
    if (value.length!=10) return;
    const urlEncodedData = new URLSearchParams(formData).toString();
   try {
     const response=await fetch('http://localhost:8000/users',{
       method:"POST",
        headers:{
          "Content-Type": "application/x-www-form-urlencoded"
       },
     body:urlEncodedData,
      });
     const json_response=await response.json();
      console.log(json_response);
   } catch (error) {
     console.log('error occured while fetching');
    }
 }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Sign Up</h2>
        <form>
          <div className="mb-3">
            <label className="block text-gray-600">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg" 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-600">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg" 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-600">Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg" 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-600">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg" 
              required 
            />
          </div>
          <div className="mb-3">
          <label className="block text-gray-600">Role</label>
          <select 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg" 
            required
          >
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Sign_Up;