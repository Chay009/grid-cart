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
          `http://localhost:2424/users/products/${productId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        setProduct(productResponse.data.product);

        const purchasedProductsResponse = await axios.get(
          `http://localhost:2424/users/purchasedProducts/${userId}`,
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
          `http://localhost:2424/users/buy/${productId}/${userId}`,
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
    <div className="container mx-auto p-6 bg-gray-900 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img
            src={product.imageLink}
            alt={product.title}
            className="w-48 h-72 object-cover rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-white mb-2">{product.title}</h2>
          <p className="text-gray-300 mb-4">{product.description}</p>
          <div className="text-xl font-semibold text-yellow-400 mb-2">
            Price: <span className="text-white">${product.price}</span>
          </div>
          <div className="text-sm text-gray-400 mb-2">
            <span className="font-semibold">Availability:</span> {product.isAvailable ? "In Stock" : "Out of Stock"}
          </div>
          <div className="text-sm text-gray-400 mb-4">
            <span className="font-semibold">Brand:</span> {product.brand}
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">Attributes</h3>
         

          <div className="flex space-x-4">
            {!isPurchased ? (
              <button
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 hover:bg-blue-700 shadow-lg"
                onClick={handleBuyNow}
              >
                BUY NOW
              </button>
            ) : (
              <>
                <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
                  Purchased
                </button>
                <button className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg">
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
