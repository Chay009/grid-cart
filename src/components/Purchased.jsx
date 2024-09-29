import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Skeleton, Typography } from "@mui/material";
import "./courseStyle.css";
import CourseCard from "./CourseCard";

function PurchasedCourses() {
 
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
const userId=localStorage.getItem("userId");
  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:2424/users/purchasedProducts/${userId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        setPurchasedProducts(res.data.purchasedProducts);
        console.log("data.purchasedProducts", res.data.purchasedProducts);
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
        component="div"
        style={{
          flexGrow: 1,
          padding: "10px",
          borderRadius: "4px",
          fontWeight: "600",
          color: "whitesmoke",
          textAlign: "center",
          marginTop: "70px",
        }}
      >
        Purchased Products
      </Typography>
      <div className="all-courses">
        {isLoading ? (
           <div style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
           <CircularProgress  color="secondary"/>
         </div>
        ) : (
          <>
            {purchasedProducts.length > 0
              ? purchasedProducts.map((purchasedProduct) => (
                  <CourseCard key={purchasedProduct.productId} product={purchasedProduct} />
                ))
              : <h2 style={{color:"white"}}>No course has yet been bought!</h2>}
          </>
        )}
      </div>
    </div>
  );
}

export default PurchasedCourses;