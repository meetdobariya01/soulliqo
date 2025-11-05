import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Import all pages
import Homepage from "./pages/homepage/homepage";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Afterlogin from "./pages/afterlogin/afterlogin";
import Whoweare from "./pages/whoweare/whoweare";
import Ourmission from "./pages/ourmission/ourmission";
import Aboutus from "./pages/aboutus/aboutus";
import Ourvalues from "./pages/ourvalues/ourvalues";
import Brandethos from "./pages/brandethos/brandethos";
import Contactus from "./pages/contactus/contactus";
import Wishlist from "./pages/wishlist/wishlist";
import Ownbox from "./pages/ownbox/Ownbox";
import BoxStyles from "./pages/box-styles/box-styles";
import Boxproduct from "./pages/boxproduct/boxproduct";
import Boxcheckout from "./pages/boxcheckout/boxcheckout";
import Checkout from "./pages/chekckout/checkout";
import Chocoblock from "./pages/chocoblock/chocoblock";
import Productgrid from "./pages/product-grid/productgrid";
import Productdetails from "./pages/productdetails/productdetails";
import Sweetindulgence from "./pages/sweetindulgence/sweetindulgence";
import Boxcollection from "./pages/boxcollection/boxcollection";
import Orderconfrimed from "./pages/orderconfrimed/orderconfrimed";
import Forgotpassword from "./pages/forgotpassword/forgotpassword";
import Otppage from "./pages/otppage/otppage";
import Otpvarification from "./pages/otpvarification/otpvarification";
import Collection from "./components/collection/collection";
import Cart from "./components/Cart/Cart";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router basename="/">
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/afterlogin" element={<Afterlogin />} />
      <Route path="/whoweare" element={<Whoweare />} />
      <Route path="/ourmission" element={<Ourmission />} />
      <Route path="/aboutus" element={<Aboutus />} />
      <Route path="/ourvalues" element={<Ourvalues />} />
      <Route path="/brandethos" element={<Brandethos />} />
      <Route path="/contactus" element={<Contactus />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/sweetindulgence" element={<Sweetindulgence />} />
      <Route path="/ownbox/:collectionId" element={<Ownbox />} />
      <Route path="/box-styles/:collectionId/:size" element={<BoxStyles />} />
      <Route path="/boxcheckout" element={<Boxcheckout />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/chocolateblock" element={<Chocoblock />} />
      <Route path="/product" element={<Productgrid />} />
      <Route path="/productdetails" element={<Productdetails />} />
      <Route path="/sweetindulgence" element={<Sweetindulgence />} />
      <Route path="/boxcollection" element={<Boxcollection />} />
      <Route path="/orderconfrimed" element={<Orderconfrimed />} />
      <Route path="/forgotpassword" element={<Forgotpassword />} />
      <Route path="/otppage" element={<Otppage />} />
      <Route path="/otpvarification" element={<Otpvarification />} />
      <Route path="/product/:id" element={<Productdetails />} />
      <Route path="/products/:category" element={<Productgrid />} />
      <Route path="/collection/:category" element={<Productgrid />} />
      <Route path="/collection" element={<Collection />} />
       <Route path="/boxproduct/:categoryId/:boxId" element={<Boxproduct />} />
       <Route path="/cart" element={<Cart />} />
    </Routes>
  </Router>
);

reportWebVitals();
