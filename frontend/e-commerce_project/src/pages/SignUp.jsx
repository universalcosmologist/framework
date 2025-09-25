import { useState } from "react";
import { useDispatch } from "react-redux";
import { hideMessage,addMessage } from "../Slices/alertSlice";
import { useNavigate } from "react-router-dom";

function Sign_Up() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const show_notification = (message) => {
      dispatch(addMessage(message));
      setTimeout(() => {
        dispatch(hideMessage());
      }, 2000);
    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData ||
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.role ||
      !formData.phone
    ){
      show_notification("signup unsuccessful");
      return;
    }

    const value = formData.phone;
    if (!/^\d*$/.test(value)){
      show_notification("signup unsuccessful");
      return;
    }
    if (value.length !== 10){
      show_notification("signup unsuccessful");
      return;
    }

    const urlEncodedData = new URLSearchParams(formData).toString();
    try {
      const response = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      });
      const json_response = await response.json();
      console.log(json_response);
      if(!json_response.error){
      show_notification("signup successful");
      setTimeout(()=>navigate("/login"),2000);
      }else{
        show_notification(`signup unsuccessful , ${json_response.error}`);
      }
    } catch (error) {
      show_notification("signup unsuccessful try again");
      console.log("error occurred while fetching", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Sign Up</h2>
        <form>
          {/* Name */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Sign_Up;
