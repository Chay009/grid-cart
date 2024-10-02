import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "./ProductCard";

function PurchasedProducts() {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/users/purchasedProducts/${userId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setPurchasedProducts(res.data.purchasedProducts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [userId]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-white bg-blue-600 rounded-lg shadow-lg p-6 mt-16">
        Purchased Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {isLoading ? (
          <div className="flex justify-center items-center w-full">
            <div className="loader border-t-transparent border-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        ) : (
          <>
            {purchasedProducts.length > 0 ? (
              purchasedProducts.map((purchasedProduct) => (
         
                <div key={purchasedProduct.productId} className="flex justify-center">
                <CourseCard product={purchasedProduct} />
              </div>
             
              ))
            ) : (
              <h2 className="text-xl text-white text-center col-span-1 sm:col-span-2 lg:col-span-3">
                No Product has yet been bought!
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PurchasedProducts;
