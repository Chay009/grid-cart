// App.js

import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ShowProducts from './components/ShowProducts';
import Products from './components/ProductPage';
import PurchasedProducts from './components/Purchased';
import SellersList from './components/SellersList';
import Call from './components/Call';
import Layout from './components/Layout'; // Import the Layout component

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ShowProducts />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products/purchased" element={<PurchasedProducts />} />
            <Route path="/products/:productId" element={<Products />} />
            <Route path="/products" element={<ShowProducts />} />
            <Route path="/contact/sellers" element={<SellersList />} />
            <Route path="/contact/seller/:sellername/:sellerId" element={<Call />} />
          </Routes>
        </Layout>
      </Router>
    </RecoilRoot>
  );
}

export default App;
