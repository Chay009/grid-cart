import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Products() {
  const userId = localStorage.getItem("userId");
  const [product, setProduct] = useState({});
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/products/${productId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setProduct(productResponse.data.product);

        const purchasedProductsResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/purchasedProducts/${userId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setPurchasedProducts(purchasedProductsResponse.data.purchasedProducts);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [productId, userId]);

  useEffect(() => {
    const isProductPurchased = purchasedProducts.some((item) => item?.productId === productId);
    setIsPurchased(isProductPurchased);
  }, [productId, purchasedProducts]);

  const handleBuyNow = async () => {
    if (userId) {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/users/buy/${productId}/${userId}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        toast.success(response.data.message);
        setPurchasedProducts([...purchasedProducts, response.data.purchasedProduct]);
        setIsPurchased(true);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    navigate('/products/purchased');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader border-t-transparent border-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className=" container mx-auto p-8 max-w-5xl bg-white rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row items-start justify-between">
        {/* Product Image Section */}
        <div className="flex-shrink-0 mb-6 lg:mb-0 lg:mr-10 w-full lg:w-1/2 text-center">
          <div className="relative inline-block">
            <img
              src={product.imageLink}
              alt={product.title}
              className="w-80 h-96 object-cover rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
            />
            {product.isAvailable && (
                 <div className="absolute top-0 left-0 w-40 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded transform -skew-y-12">
                In Stock
              </div>
            )}
            {!product.isAvailable && (
              <div className="absolute top-0 left-0 w-40 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded transform -skew-y-12">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="flex w-full lg:w-1/2">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">
            {product.title}
          </h2>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-lg">★★★★☆</span>
            <span className="ml-2 text-sm text-gray-600">(4.5 out of 5 stars)</span>
          </div>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed font-roboto">
            {product.description}
          </p>
          <div className="mb-6">
            <span className="text-2xl font-semibold text-gray-900 font-poppins">
              Price:
            </span>
            <span className="ml-2 text-2xl text-blue-600">${product.price}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4">
            <div className="mb-4 lg:mb-0">
              <span className="font-semibold text-gray-900 font-roboto">Availability:</span>
              <span className={`ml-2 font-bold ${product.isAvailable ? "text-green-700" : "text-red-700"}`}>
                {product.isAvailable ? "Available Now" : "Out of Stock"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 font-roboto">Brand:</span>
              <span className="ml-2 text-gray-800">{product.brand}</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3 font-roboto">Product Attributes</h3>
          <ul className="list-disc list-inside text-gray-700 mb-8">
            <li>High quality material</li>
            <li>1-year warranty</li>
            <li>Available in multiple colors</li>
          </ul>

          {/* Buy Button Section */}
          <div className="flex  space-x-4">
            {!isPurchased ? (
              <button
                className="flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 hover:bg-blue-700 shadow-lg transform hover:scale-105"
                onClick={handleBuyNow}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13h.01M7 13a3 3 0 103 3H7a3 3 0 01-3-3z"
                  />
                </svg>
                BUY NOW
              </button>
            ) : (
              <>
                <button className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
                  Purchased
                </button>
                <button
                  className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                  onClick={() => navigate(`/products/purchased`)}
                >
                  View Content
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
