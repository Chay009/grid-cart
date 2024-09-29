import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import { RecoilRoot } from 'recoil';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ShowProducts from './components/ShowProducts';
import Products from './components/ProductPage';
import PurchasedProducts from './components/Purchased';
import Appbar from './components/Appbar';
import backgroundImg from "/Background.svg"
import { Call } from './components/Call';
import SellersList from './components/SellersList';


function App() {
  return (
    <RecoilRoot>
      <div 
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          backgroundColor: "black",
          overflow: "auto",
          overflowX:"hidden"
        }}
      >
    <Router>
      <Appbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element= {<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />} />
         <Route path ="/products/purchased" element ={<PurchasedProducts />} />
         <Route path ="/products/:productId" element ={<Products />} />
         <Route path ="/products" element = {<ShowProducts />} />
         <Route path ="/contact/sellers" element ={<SellersList/>} />
         <Route path ="/contact/seller/:sellername/:sellerId" element ={<Call/>} />
       
      </Routes>
    </Router>
    </div>
    </RecoilRoot>
  );
}

export default App;
