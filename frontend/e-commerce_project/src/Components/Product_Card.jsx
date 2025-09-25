import { addMessage,hideMessage } from "../Slices/alertSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  // Function to render star ratings
  //send the request to backend with this produt id and token alogwith
  //we need to use async await to hndle the response of async function
  const token=localStorage.getItem('token');
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const renderStars = (rating) => {
    const fullStars = "★".repeat(Math.round(rating));
    const emptyStars = "☆".repeat(5 - Math.round(rating));
    return `${fullStars}${emptyStars}`;
  };

  const show_notification=(message)=>{
      dispatch(addMessage(message));
      setTimeout(()=>{
        dispatch(hideMessage());
      },2000);
  }

  const add_in_cart=async(product_id)=>{
      try {
        const res=await fetch('http://localhost:8000/cart',{
          method:"POST",
          headers:{
            'Content-Type':'application/json',
            "Authorization":`Bearer ${token}`,
          },
          body: JSON.stringify({
            product_id,
          }),
        });
        const item=await res.json();
        console.log("new item added in db",item);
      } catch (error) {
        console.log("error occured in add_in_cart function",error);
      }
  }

  const check_already_exist=async(product_id)=>{
      try {
        const res=await fetch(`http://localhost:8000/cart/check?product_id=${product_id}`,{
          method:"GET",
          headers:{
            "Authorization":`Bearer ${token}`,
          },
        });
        const check=await res.json();
        return check;
       } catch (error) {
         console.log("error occured in check_already_exist function",error);
         return null;
       }
  }

  const handleViewProduct=()=>{
     navigate('/viewproduct',{state:{product}});
  }

  const handleAddInCart=async()=>{
    // this will add this product only once in cart
    if(token){
      try {
        const exist=await check_already_exist(product._id);
        if(!exist){
          dispatch(addMessage("some error occured in handleAddInCart"));
        }
        if(exist.isPresent){
          dispatch(addMessage("item already in the cart"));
        }else{
          await add_in_cart(product._id);
          dispatch(addMessage("item added in the cart"));
        }
    
        setTimeout(() => {
          dispatch(hideMessage());
        }, 2000);
      } catch (error) {
        console.log("error occured in handleAddInCart function",error);
      }
    }else{
      show_notification("cannot add in cart without account");
    }
  }

  return (
    <div className="bg-red-200 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-700 text-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
        <img 
          src={product.image_url}
          alt={product.title}
          className="w-full h-48 object-contain bg-white p-2 rounded-lg"
        />
        <h2 className="text-lg font-bold mt-4">{product.title}</h2>
        <p className="text-gray-400 text-sm mt-2">{product.description}</p>
        <p className="text-yellow-400 font-semibold mt-2">${product.price}</p>
        <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <span className="text-yellow-400">{renderStars(product.rating.rate)}</span>
          <span className="text-gray-400 text-sm ml-2">
            ({product.rating.count} reviews)
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
          onClick={handleViewProduct}
          >
            View Product
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
          onClick={handleAddInCart}
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    image_url: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.string,
    rating: PropTypes.shape({
      rate: PropTypes.number,
      count: PropTypes.number,
    }),
  }).isRequired,
};

export default ProductCard;