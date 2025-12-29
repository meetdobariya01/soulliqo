import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  InputGroup,
  NavDropdown,
  Dropdown,
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

  const categories = [
    { id: 1, title: "Chocolate Block", link: "/chocolateblock" },
    { id: 2, title: "Sweet Indulgence", link: "/sweetindulgence" },
    { id: 3, title: "Melt in Mouth", link: "/product" },
  ];

  return (
    <div>
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container fluid className="d-flex justify-content-between align-items-center">

          {/* Mobile Left Icons */}
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
          <Navbar.Brand href="/" className="mx-auto mx-lg-0">
            <img
              src="/images/original-logo.png"
              alt="Logo"
              className="logo"
            />
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Nav className="mx-auto d-none d-lg-flex navbar-font">
            <NavDropdown title="SHOP" className="custom-dropdown figtree-font">
              {categories.map((category) => (
                <NavDropdown.Item key={category.id} href={category.link}>
                  {category.title}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            <NavDropdown
              title="THE SOULLIQO STORY"
              className="custom-dropdown figtree-font"
            >
              <NavDropdown.Item href="/whoweare">Who We Are</NavDropdown.Item>
              <NavDropdown.Item href="/ourmission">
                Our Mission and Values
              </NavDropdown.Item>
              <NavDropdown.Item href="/aboutus">
                All about SOULLIQO
              </NavDropdown.Item>
              <NavDropdown.Item href="/brandethos">
                Brand Ethos
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/contactus">CONTACT US</Nav.Link>
            <Nav.Link href="/gallery">LOOKBOOK</Nav.Link>
            <Nav.Link href="/faqs">FAQs</Nav.Link>
          </Nav>

          {/* Right Icons */}
          <div className="d-flex align-items-center gap-3">
            <FaSearch
              className="icon-btn d-none d-lg-block"
              onClick={() => setSearchOpen(!searchOpen)}
            />

            <Link to="/boxcheckout" className="icon-btn position-relative">
              <FaShoppingBag />
              <span className="cart-count">1</span>
            </Link>

            <Link to="/wishlist" className="icon-btn">
              <FaHeart />
            </Link>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant=""
                id="user-dropdown"
                className="icon-btn"
                style={{ color: "#f0dfc9" }}
              >
                <FaUser size={18} />
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown figtree-font">
                <Dropdown.Item as={Link} to="/login">
                  🔐 Login
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/orders">
                  📝 Orders
                </Dropdown.Item>
                <Dropdown.Item className="text-danger">
                  🚪 Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <Nav className="flex-column text-center">
            <NavDropdown title="SHOP" className="custom-dropdown figtree-font">
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

            <Nav.Link href="/contactus" onClick={() => setMenuOpen(false)}>
              CONTACT US
            </Nav.Link>
            <Nav.Link href="/gallery" onClick={() => setMenuOpen(false)}>
              LOOKBOOK
            </Nav.Link>
            <Nav.Link href="/faqs" onClick={() => setMenuOpen(false)}>
              FAQs
            </Nav.Link>
          </Nav>
        </div>
      </Navbar>

      {/* Search Overlay */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="search-box">
          <InputGroup>
            <Form.Control placeholder="Search products..." />
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
