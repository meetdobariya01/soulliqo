import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHouse } from '@awesome.me/kit-KIT_CODE/icons/classic/solid'
// import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "../../index.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Static categories
  const categories = [
    { id: 1, title: "Chocolate Block", link: "/chocolateblock" },
    { id: 2, title: "Sweet Indulgence", link: "/sweetindulgence" },
    { id: 3, title: "Melt in Mouth", link: "/product" },
  ];

  return (
    <div>
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container
          fluid
          className="d-flex justify-content-between align-items-center"
        >
          {/* Left side (Mobile Hamburger + Search) */}
          <div className="d-lg-none d-flex align-items-center">
            <FaBars
              className="icon-btn me-3"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            <FaSearch
              className="icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
            />
          </div>

          {/* Logo */}
          <Navbar.Brand
            href="/"
            className="mx-auto mx-lg-0 d-flex align-items-center"
          >
            <img src="/images/logo.jpg" alt="Logo" className="logo" />
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Nav className="mx-auto d-none d-lg-flex navbar-font">
            {/* SHOP Dropdown */}
            <NavDropdown title="SHOP" id="brand-dropdown" className="custom-dropdown">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <NavDropdown.Item key={category.id} href={category.link}>
                    {category.title}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item href="#">Loading...</NavDropdown.Item>
                
              )}
              {categories.map((category) => (
                <NavDropdown.Item key={category.id} href={category.link}>
                  {category.title}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            {/* BRAND JOURNEY */}
            <NavDropdown title="BRAND JOURNEY" id="brand-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="/whoweare">Who we Are</NavDropdown.Item>
              <NavDropdown.Item href="/ourmission">Our Mission</NavDropdown.Item>
              <NavDropdown.Item href="/aboutus">All about SOULLIQO</NavDropdown.Item>
              <NavDropdown.Item href="/ourvalues">Our Values</NavDropdown.Item>
              <NavDropdown.Item href="/brandethos">Brand Ethos</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/contactus">CONTACT US</Nav.Link>
          </Nav>

          {/* Right side icons */}
          <div className="d-flex align-items-center gap-3">
            <FaSearch
              className="icon-btn d-none d-lg-block"
              onClick={() => setSearchOpen(!searchOpen)}
            />
            <Link to="/boxcheckout" className="icon-btn position-relative ms-3">
              <FaShoppingBag />
              <span className="cart-count">1</span>
            </Link>
            <Link to="/wishlist" className="icon-btn ms-3">
              <FaHeart />
            </Link>
            <Link to="/login" className="icon-btn ms-3">
              <FaUser />
            </Link>
                   {/* <FontAwesomeIcon icon={faHouse} /> */}

          </div>
        </Container>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <Nav className="flex-column text-center">
            {/* Mobile SHOP */}
            <NavDropdown title="SHOP" id="mobile-shop-dropdown" className="custom-dropdown">
              {categories.map((category) => (
                <NavDropdown.Item
                  key={category.id}
                  href={category.link}
                  onClick={() => setMenuOpen(false)}
                >
                  {category.title}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            {/* Mobile BRAND JOURNEY */}
            <NavDropdown title="BRAND JOURNEY" id="mobile-brand-dropdown" className="custom-dropdown">
              <NavDropdown.Item href="/whoweare" onClick={() => setMenuOpen(false)}>Who we Are</NavDropdown.Item>
              <NavDropdown.Item href="/ourmission" onClick={() => setMenuOpen(false)}>Our Mission</NavDropdown.Item>
              <NavDropdown.Item href="/aboutus" onClick={() => setMenuOpen(false)}>All about SOULLIQO</NavDropdown.Item>
              <NavDropdown.Item href="/ourvalues" onClick={() => setMenuOpen(false)}>Our Values</NavDropdown.Item>
              <NavDropdown.Item href="/brandethos" onClick={() => setMenuOpen(false)}>Brand Ethos</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/contactus" onClick={() => setMenuOpen(false)}>CONTACT US</Nav.Link>
          </Nav>
        </div>
      </Navbar>

      {/* Search Bar Overlay */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="search-box">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search products..."
              className="search-input"
            />
            <button className="btn-search">Search</button>
            <FaTimes
              className="icon-btn close-search"
              onClick={() => setSearchOpen(false)}
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Header;
