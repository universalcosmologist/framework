import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMessage, hideMessage } from "../Slices/alertSlice";
import { useDispatch } from "react-redux";
import { useProductContext } from "../../contexts/ProductContext";

function Login() {
  const navigate = useNavigate();
  const { setFresh } = useProductContext();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const show_notification = (message) => {
    dispatch(addMessage(message));
    setTimeout(() => {
      dispatch(hideMessage());
    }, 2000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!formData || !formData.email || !formData.password) {
      show_notification("Fields should not be empty");
      return;
    }
    const urlEncodedData = new URLSearchParams(formData).toString();
    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      });
      const data = await response.json();
      if (data.message) {
        localStorage.setItem("token", data.token);
        show_notification("Login successful");
        setFresh(false);
        setTimeout(() => navigate("/"), 100);
      } else {
        show_notification("Login failed");
        if (data.error) console.log(data.error);
      }
    } catch (error) {
      console.log("Error occurred while fetching", error);
    }
  };

  const handleEmailChange = (e) => setFormData({ ...formData, email: e.target.value });
  const handlePasswordChange = (e) => setFormData({ ...formData, password: e.target.value });

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Log In</h2>
        <form>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
          >
            Submit
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
