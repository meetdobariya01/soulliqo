import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import "../../index.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/categories") // adjust baseURL as per backend
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div>
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container fluid className="d-flex justify-content-between align-items-center">

          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="mx-auto mx-lg-0 d-flex align-items-center">
            <img src="./images/logo.jpg" alt="Logo" className="logo" />
          </Navbar.Brand>

          {/* Center Navigation */}
          <Nav className="mx-auto d-none d-lg-flex navbar-font">
            <NavDropdown title="SHOP" id="shop-dropdown" className="custom-dropdown">
              {categories.map(cat => (
                <NavDropdown.Item
                  as={Link}
                  key={cat.id}
                  to={cat.link}
                >
                  {cat.title}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            <NavDropdown title="BRAND JOURNEY" id="brand-dropdown" className="custom-dropdown">
              <NavDropdown.Item as={Link} to="/whoweare">Who we Are</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ourmission">Our Mission</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/aboutus">All about SOULLIQO</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/ourvalues">Our Values</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/brandethos">Brand Ethos</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/contactus">CONTACT US</Nav.Link>
          </Nav>

          {/* Right Side Icons */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="icon-btn position-relative ms-3">
              <FaShoppingBag />
              <span className="cart-count">1</span>
            </Link>
            <Link to="/wishlist" className="icon-btn ms-3"><FaHeart /></Link>
            <Link to="/login" className="icon-btn ms-3"><FaUser /></Link>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
