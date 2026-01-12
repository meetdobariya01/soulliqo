

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
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const categories = [
    { id: 1, title: "Chocolate Block", link: "/chocolateblock" },
    { id: 2, title: "Sweet Indulgence", link: "/sweetindulgence" },
    { id: 3, title: "Melt in Mouth", link: `/products/${encodeURIComponent("MELT IN MOUTH")}` },

  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guestCart"); // optional

    navigate("/login"); // or "/"
  };

  // 🔍 SEARCH HANDLER (NAME + CATEGORY)
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.soulliqo.com/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container fluid className="d-flex justify-content-between align-items-center">

          {/* Mobile Icons */}
          <div className="d-lg-none d-flex align-items-center">
            <FaBars className="icon-btn me-3" onClick={() => setMenuOpen(!menuOpen)} />
            <FaSearch className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} />
          </div>

          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="mx-auto mx-lg-0">
            <img src="/images/original-logo.png" alt="Logo" className="logo" />
          </Navbar.Brand>

          {/* Desktop Menu */}
          <Nav className="mx-auto d-none d-lg-flex navbar-font">
            <NavDropdown title="SHOP" className="custom-dropdown figtree-font">
              {categories.map((cat) => (
                <NavDropdown.Item key={cat.id} as={Link} to={cat.link}>
                  {cat.title}
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

            <Nav.Link as={Link} to="/contactus">CONTACT US</Nav.Link>
            <Nav.Link as={Link} to="/gallery">LOOKBOOK</Nav.Link>
          </Nav>

          {/* Right Icons */}
          <div className="d-flex align-items-center gap-4">
            <FaSearch className="icon-btn d-none d-lg-block" onClick={() => setSearchOpen(!searchOpen)} />

            <Link to="/cart" className="icon-btn position-relative">
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
                <Dropdown.Item as={Link} to="/login">🔐 Login</Dropdown.Item>
                <Dropdown.Item as={Link} to="/orders">📝 Orders</Dropdown.Item>
                <Dropdown.Item
                  className="text-danger"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>

      {/* SEARCH OVERLAY */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`}>
        <div className="search-box">
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <FaTimes
              className="icon-btn close-search text-light"
              onClick={() => {
                setSearchOpen(false);
                setSearchResults([]);
                setSearchQuery("");
              }}
            />
          </InputGroup>

          {/* SEARCH RESULTS */}
          {searchResults.length > 0 && (
            <div className="search-results text-light">
              {searchResults.map((item) => (
                <div
                  key={item._id}
                  className="search-item"
                  onClick={() => handleResultClick(item._id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu mt-5 ${menuOpen ? "open" : ""}`}>
        <Nav className="flex-column text-center">
           <NavDropdown title="SHOP" className="custom-dropdown figtree-font">
          {categories.map((cat) => (
            <Nav.Link className="mobile-nav-link"
              key={cat.id}
              as={Link}
              to={cat.link}
              onClick={() => setMenuOpen(false)}
            >
              {cat.title}
            </Nav.Link>
          ))}</NavDropdown>
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
            <Nav.Link href="/contactus" onClick={() => setMenuOpen(false)}>
              CONTACT US
            </Nav.Link>
            <Nav.Link href="/gallery" onClick={() => setMenuOpen(false)}>
              LOOKBOOK
            </Nav.Link>
           
          </Nav>
      </div>
    </div>
  );
};

export default Header;
