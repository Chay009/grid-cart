import { Box, Card, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DownloadIcon from "@mui/icons-material/Download";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import "./courseStyle.css";
console.log(import.meta.env.VITE_SERVER_URL);

function Courses() {
  const userId=localStorage.getItem("userId");
  const [product, setProduct] = useState({});
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { productId } = useParams();
  console.log(useParams());

const navigate=useNavigate()
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
console.log(productResponse.data.product)
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
  }, [productId]);

  useEffect(() => {
    console.log(purchasedProducts)
 
    const isProductPurchased = purchasedProducts.some((item) => item?.productId === productId);
    setIsPurchased(isProductPurchased);
  }, [productId, purchasedProducts]);





  const handleBuyNow = async () => {
    const userId=localStorage.getItem('userId');
    if(userId){
      try {
        setIsLoading(true);
  
        const response = await axios.post(
          `http://localhost:2424/users/buy/${productId}/${userId}`,
          {
  
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
  
        toast.success(response.data.message);
  
        setPurchasedProducts([...purchasedProducts, response.data.purchasedCourse]);
        setIsPurchased(true);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    console.log(userId)
    navigate('/courses/purchased')
   
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "300px",
        }}
      >
        <CircularProgress color="secondary" />
      </div>
    );
  }
  console.log(product)

  return (
    <div className="single-course" >
      <div className="text-container">
        <div>
          <img
            src={product?.imageLink}
            alt={product?.imageLink}
            width={"200px"}
            style={{ borderRadius: "20px" }}
          />
        </div>
        <div>
          <h5 style={{color:"white",fontSize:"25px"}}>{product?.title}</h5>
        </div>

        <div>
          <p style={{color:"white",fontSize:"10px",fontStyle:"italic"}}>
            {product?.description}
          </p>
        </div>

        <div>
          {!isPurchased ? (
            <button
              className="button-btn"
              style={{ width: "180px" }}
              onClick={handleBuyNow}
            >
              BUY NOW @${product?.price}
            </button>
          ) : (
            <div>
              <button
                style={{
                  backgroundColor: "green",
                  padding: "10px 20px",
                  fontWeight: "700",
                  fontSize: "15px !important",
                  borderRadius: "50px",
                  color:"white",
                  borderWidth: "0px"
                }}
              >
                Purchased
              </button>
              <button
                style={{
                  backgroundColor: "#1E267A",
                  padding: "10px 20px",
                  fontWeight: "700",
                  fontSize: "15px !important",
                  borderRadius: "50px",
                  color:"white",
                  borderWidth: "0px",
                  marginLeft: "20px",
                }}
              >
                View Content
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <Card
          className="cardstyle"
          variant="outlined"
          sx={{ width: "350px", height: "440px" }}
          style={{
            backgroundColor: "#601b99",
            color: "white",
            borderRadius: "10px",
            display: "flex",
            padding: "5px",
          }}
        >
          <CardActionArea>
            <CardContent style={{ textAlign: "center" }}>
              <Typography gutterBottom variant="h6" component="div"  back>
                Course Overview
              </Typography>
              <br />
              <Box
                sx={{
                  bgcolor: "background.paper",
                  color: "black",
                  borderRadius: "20px",
                  padding: "5px 2px",
                }}
              >
                <nav aria-label="main mailbox folders">
                  <List style={{ padding: "5px" }}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <SignalCellularAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Beginner to Pro" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <OndemandVideoIcon />
                        </ListItemIcon>
                        <ListItemText primary="20+ Hours of HD video" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <FormatListBulletedIcon />
                        </ListItemIcon>
                        <ListItemText primary="150+ Lessons" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DownloadIcon />
                        </ListItemIcon>
                        <ListItemText primary="Downloadable content" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <ClosedCaptionIcon />
                        </ListItemIcon>
                        <ListItemText primary="English captions" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <MilitaryTechIcon />
                        </ListItemIcon>
                        <ListItemText primary="Certificate of completion" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <AllInclusiveIcon />
                        </ListItemIcon>
                        <ListItemText primary="Lifetime access" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </nav>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </div>
  );
}

export default Courses;
