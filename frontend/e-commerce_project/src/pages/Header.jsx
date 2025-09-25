import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addMessage, hideMessage } from "../Slices/alertSlice";
import { useProductContext } from "../../contexts/ProductContext";
import { useDispatch } from "react-redux";
import Button from "../Components/Button";

function Header() {
  const [products, setProducts] = useState(null);
  const { data, setFresh } = useProductContext();
  const navigate = useNavigate();
  const [input_title, setInput_Title] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected_category, setSelected_Category] = useState("All");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    setProducts(data);
  }, [data]);

  const show_notification = (message) => {
    dispatch(addMessage(message));
    setTimeout(() => {
      dispatch(hideMessage());
    }, 2000);
  };

  const categories = ["All", "men's clothing", "women's clothing", "electronics", "jewellery"];

  const check = (product_title, input_title) => {
    const input_words = new Set(input_title.toLowerCase().split(/\s+/));
    const product_words = new Set(product_title.toLowerCase().split(/\s+/));
    for (let word of input_words) {
      if (product_words.has(word)) return true;
    }
    return false;
  };

  const handle_home_page = () => navigate("/");
  const handle_log_out = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      show_notification("user already logged out");
      return;
    } else {
      localStorage.removeItem("token");
      show_notification("user logged out");
      setFresh(false);
      return;
    }
  };
  const takeToCart = () => navigate("/cart");
  const handleViewProfile = () => navigate("/user");

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      let matched_products = products
        ? products.filter(
            (product) =>
              check(product.title, input_title) &&
              (product.category === selected_category || selected_category === "All")
          )
        : [];
      if (input_title === "") matched_products = [];
      navigate("/search_product", { state: { matched_products } });
      setLoading(false);
    }, 500);
  };

  return (
    <header className="w-full shadow-sm bg-white border-b">
      {/* Top navigation bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Left Section - Logo */}
        <div
          onClick={handle_home_page}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          Quick-Kart
        </div>

        {/* Center Section - Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md w-1/2">
          <select
            value={selected_category}
            onChange={(e) => setSelected_Category(e.target.value)}
            className="bg-transparent outline-none text-gray-700 text-sm"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 bg-transparent outline-none px-2 text-sm"
            value={input_title}
            onChange={(e) => setInput_Title(e.target.value)}
          />
          <Button onClick={handleFilter} variant="secondary">
            Search
          </Button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex gap-3 items-center">
          <Button onClick={takeToCart} variant="secondary">
            Cart
          </Button>
          {!token && (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
          <Link to="/product">
            <Button>Create</Button>
          </Link>
          {token && <Button onClick={handleViewProfile}>Profile</Button>}
          <Button onClick={handle_log_out} variant="danger">
            Logout
          </Button>
        </div>
      </div>

      {/* Loading bar */}
      {loading && <div className="w-full h-1 bg-blue-500 animate-pulse"></div>}
    </header>
  );
}

export default Header;
