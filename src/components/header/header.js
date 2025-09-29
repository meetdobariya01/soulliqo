import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
            <img src="./images/logo.jpg" alt="Logo" className="logo" />
            {/* <span className="logo-text">SOULIQO</span> */}
          </Navbar.Brand>

          {/* Center Navigation (Desktop Only) */}
          <Nav className="mx-auto d-none d-lg-flex navbar-font">
            <NavDropdown
              title="SHOP"
              id="brand-dropdown"
              className="custom-dropdown"
            >
              <NavDropdown.Item href="/chocolateblock">Chocolate Block </NavDropdown.Item>
              <NavDropdown.Item href="/sweetindulgence">Sweet Indulgence</NavDropdown.Item>
              <NavDropdown.Item href="#">Melt In Mouth</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="BRAND JOURNEY"
              id="brand-dropdown"
              className="custom-dropdown"
            >
              <NavDropdown.Item href="/whoweare">Who we Are</NavDropdown.Item>
              <NavDropdown.Item href="/ourmission">
                Our Mission
              </NavDropdown.Item>
              <NavDropdown.Item href="/aboutus">
                All about SOULLIQO
              </NavDropdown.Item>
              <NavDropdown.Item href="/ourvalues">Our Values</NavDropdown.Item>
              <NavDropdown.Item href="/brandethos">
                Brand Ethos
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/contactus">CONTACT US</Nav.Link>
          </Nav>

          {/* Right side Icons */}
          <div className="d-flex align-items-center gap-3">
            <FaSearch
              className="icon-btn d-none d-lg-block"
              onClick={() => setSearchOpen(!searchOpen)}
            />
            <Link to="/cart" className="icon-btn position-relative ms-3">
              <FaShoppingBag />
              <span className="cart-count">1</span>
            </Link>
            <Link to="/wishlist" className="icon-btn ms-3">
              <FaHeart />
            </Link>

            <Link to="/login" className="icon-btn ms-3">
              <FaUser />
            </Link>
          </div>
        </Container>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <Nav className="flex-column text-center">
            <NavDropdown
              title="SHOP"
              id="brand-journey-dropdown"
              className="custom-dropdown"
            >
              <NavDropdown.Item
                href="/chocolateblock"
                onClick={() => setMenuOpen(false)}
              >
                Chocolate Block
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/sweetindulgence"
                onClick={() => setMenuOpen(false)}
              >
                Sweet Indulgence
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/aboutus"
                onClick={() => setMenuOpen(false)}
              >
                Melt In Mouth
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="BRAND JOURNEY"
              id="brand-journey-dropdown"
              className="custom-dropdown"
            >
              <NavDropdown.Item
                href="/whoweare"
                onClick={() => setMenuOpen(false)}
              >
                Who we Are
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/ourmission"
                onClick={() => setMenuOpen(false)}
              >
                Our Mission
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/aboutus"
                onClick={() => setMenuOpen(false)}
              >
                All about SOULLIQO
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/ourvalues"
                onClick={() => setMenuOpen(false)}
              >
                Our Values
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/brandethos"
                onClick={() => setMenuOpen(false)}
              >
                Brand Ethos
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/contactus" onClick={() => setMenuOpen(false)}>
              CONTACT US
            </Nav.Link>
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
