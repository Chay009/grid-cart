import React, { useEffect, useState } from "react";
import { Card, Skeleton, Typography } from "@mui/material";
import "../index.css";
import { atom, useRecoilState } from "recoil";
import axios from "axios";
import CourseCard from "./ProductCard";
import "./courseStyle.css";

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
      .get("http://localhost:2424/users/get-all-products/", {
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
    <div>
      <Typography
        variant="h4"
        style={{
          padding: "10px",
          borderRadius: "4px",
          fontWeight: "bold",
          color: "whitesmoke",
          textAlign: "center",
          fontSize: "25px",
          marginBottom: "10px",
        }}
      >
        All Products
      </Typography>
      {/* <Card
      // style={{
      //   margin: 10,
      //   width: 1000,
      //   minHeight: 100,
      // }}
    >     */}
      <div className="all-courses">
        {isLoading ? (
          <div style={{ display: "flex", gap: "20px" }}>
            <Skeleton variant="rectangular" width={345} height={400} />
            <Skeleton variant="rectangular" width={345} height={400} />
            <Skeleton variant="rectangular" width={345} height={400} />
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              products.map((product) => (
                <CourseCard key={product.productId} product={product} />
              ))
            ) : (
              <h2 sx={{ color: "white" }}>
                "Oops! No course is currently offered. Return later!"
              </h2>
            )}
          </>
        )}
      </div>
      {/* </Card> */}
    </div>
  );
}

export default ShowProducts;
