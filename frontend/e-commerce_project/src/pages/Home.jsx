import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductContext } from "../../contexts/ProductContext";

function Home() {
  const [product, setProduct] = useState(null);
  const { data } = useProductContext();
  const navigate = useNavigate();

  const category_list = ["men's clothing", "women's clothing", "electronics", "jewellery"];

  useEffect(() => {
    setProduct(data);
  }, [data]);

  const handleCategoryDisplay = (category) => {
    navigate("/productcategory", { state: { product, category } });
  };

  if (!product) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-md mx-6 my-10">
        <div className="text-2xl font-semibold mb-4">Please login to access application</div>
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition-all duration-200 font-medium"
        >
          Click here to login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Explore Our Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {category_list.map((category) => (
          <div
            key={category}
            className="flex flex-col items-center justify-between rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white p-8 border border-gray-200 hover:border-blue-500"
          >
            <h2 className="text-xl font-bold text-gray-700 capitalize mb-6 text-center">
              {category}
            </h2>
            <button
              onClick={() => handleCategoryDisplay(category)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-all duration-200"
            >
              Explore Products
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
