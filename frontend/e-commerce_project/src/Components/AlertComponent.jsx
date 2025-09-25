import { useSelector, useDispatch } from "react-redux";
import { hideMessage } from "../Slices/alertSlice";
import { useEffect, useState } from "react";

function AlertComponent() {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.alerts.message);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message && message !== "") {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => dispatch(hideMessage()), 300); // wait for animation
      }, 3000); // auto-hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message || message === "") return null;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 
      max-w-md w-[90%] 
      bg-gradient-to-r from-blue-500 to-purple-500 
      text-white font-semibold p-4 rounded-xl shadow-xl
      flex items-center justify-between
      transition-all duration-300
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}
      `}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => dispatch(hideMessage()), 300);
        }}
        className="ml-4 text-white hover:text-red-300 font-bold text-lg transition-colors"
      >
        ✖
      </button>
    </div>
  );
}

export default AlertComponent;
