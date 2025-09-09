import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";

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
    </Routes>
  </Router>
);

reportWebVitals();
