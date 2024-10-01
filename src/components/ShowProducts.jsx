import React, { useEffect, useState } from "react";

import "../index.css";
import { atom, useRecoilState } from "recoil";
import axios from "axios";
import ProductCard from "./ProductCard";


const productState = atom({
  key: "productState",
  default: [],
});

function ShowProducts() {
  
  const [products, setProducts] = useRecoilState(productState);
  console.log(products[0]?.productId)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/users/get-all-products/`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setProducts(res.data.products);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

 return (
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold text-center text-white bg-blue-600 rounded-lg shadow-lg p-6 mt-16">
     All Products
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 my-8">
      {isLoading ? (
        <div className="flex justify-center items-center w-full">
          <div className="loader border-t-transparent border-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      ) : (
        <>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        ) : (
          <h2 sx={{ color: "white" }}>
            "Oops! No course is currently offered. Return later!"
          </h2>
        )}
      </>
      )}
    </div>
  </div>
);
}

export default ShowProducts;
