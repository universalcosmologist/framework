import { useState } from "react";
import { addMessage, hideMessage } from "../Slices/alertSlice";
import { useDispatch } from "react-redux";
//i want to disable to button when the upload is going on

export default function Product() {
  const [loading,setLoading]=useState(false);
  const url=import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image_file: null,
  });

  const dispatch = useDispatch();
  const show_notification = (message) => {
    dispatch(addMessage(message));
    setTimeout(() => {
      dispatch(hideMessage());
    }, 2000);
  };

  const handlePriceChange = (str) => {
    let value = str.trim();
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      setFormData({ ...formData, price: "0" });
      show_notification("Enter valid price format");
      return false;
    }
    let number = parseFloat(value);
    if (number > 0) {
      setFormData({ ...formData, price: String(number) });
    } else {
      setFormData({ ...formData, price: "0" });
    }
    return true;
  };

  const handleAnyFormElementChange = (event) => {
    const { value, name, type, files } = event.target;
    if (type === "file") {
      const file = files[0];
      if (!file || !file.type.startsWith("image/")) {
        setFormData({ ...formData, image_file: null });
      } else setFormData({ ...formData, image_file: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!formData.image_file) {
      show_notification("Product image is required");
      setLoading(false);
      return;
    }
    if (!formData.title || !formData.category || !formData.description || !handlePriceChange(formData.price)) {
      show_notification("Please fill all fields correctly");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const file = formData.image_file;
      const response = await fetch(
        `${url}/image/generate_url?fileName=${file.name}&fileType=${file.type}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { fileUrl, uploadUrl } = await response.json();

      const putResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!putResponse.ok) {
        console.error("Image upload failed!", putResponse.status, await putResponse.text());
        show_notification("image upload failed");
        setLoading(false);
        return;
      }

      const product_creation_response = await fetch(`${url}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: formData.price,
          image_url: fileUrl,
        }),
      });

      const res = await product_creation_response.json();
      if (res.login_required_message || res.invalid_token_message) {
        show_notification("Login needed");
      } else {
        show_notification("Product created successfully!");
        setFormData({
          title: "",
          description: "",
          category: "",
          price: "",
          image_file: null,
        });
      }
    } catch (error) {
      show_notification(`product is not created , ${error}`);
      console.log("upload failed error occurred", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create a New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter product title"
              value={formData.title}
              onChange={handleAnyFormElementChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleAnyFormElementChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="men&apos;s clothing">Men&apos;s Clothing</option>
              <option value="women&apos;s clothing">Women&apos;s Clothing</option>
              <option value="jewellery">Jewellery</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleAnyFormElementChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            ></textarea>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleAnyFormElementChange}
              onBlur={(e) => handlePriceChange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Image */}
          <div>
            <label htmlFor="image" className="block text-gray-700 font-medium mb-1">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleAnyFormElementChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`font-semibold px-6 py-2 rounded-lg shadow-md transition
                  ${loading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"}
              `}
          >
            {loading ? "Uploading Product..." : "Submit Product"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
