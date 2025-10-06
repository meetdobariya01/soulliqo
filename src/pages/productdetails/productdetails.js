import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Carousel,
  Tab,
  Nav,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Heart, HeartFill } from "react-bootstrap-icons";
import "../../index.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Reletedproduct from "../../components/reletedproduct/reletedproduct";
const Productdetails = () => {
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState("");
  const images = [
    "./images/product-details1.jpg",
    "./images/chocolate-block-product.png",
    "./images/product-details1.jpg",
    "./images/chocolate-block-product.png",
  ];
  // Main image state
  const [mainImage, setMainImage] = useState(images[0]);
  const handleAddToCart = () => {
    alert(`Added ${qty} item(s) to cart ✅`);
  };
  const handleWishlist = () => {
    setWishlist(!wishlist);
  };
  const handleCheckPincode = () => {
    if (pincode === "380001" || pincode === "110001") {
      setPincodeMessage("✅ Delivery available to your pincode.");
    } else {
      setPincodeMessage("❌ Sorry, delivery not available.");
    }
  };
  return (
    <div>
      {/* HEADER */}
      <Header />
      <Container fluid className="py-5 container">
        <Row>
          {/* LEFT SIDE IMAGES (DESKTOP VIEW) */}
          <Col md={6} className="d-none d-md-block">
            <Row>
              {/* Thumbnail Images */}
              <Col xs={3} className="d-flex flex-column">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="thumbnail"
                    className="img-fluid mb-3 rounded border"
                    style={{
                      cursor: "pointer",
                      border:
                        mainImage === img
                          ? "2px solid #7B4B3A"
                          : "1px solid #ddd",
                    }}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </Col>
              {/* Main Image */}
              <Col xs={9}>
                <img
                  src={mainImage}
                  alt="main product"
                  className="img-fluid rounded shadow"
                />
              </Col>
            </Row>
          </Col>
          {/* MOBILE CAROUSEL */}
          <Col xs={12} className="d-md-none mb-4">
            <Carousel>
              {images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100 rounded"
                    src={img}
                    alt={`Slide ${index}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          {/* RIGHT SIDE DETAILS */}
          <Col md={6}>
            <h3 className="product-name">TIRAMISU</h3>
            <p className="product-weight mb-3">Wt. 75gm</p>
            <div className="d-flex align-items-center mb-4 product-reviews">
              <span className="text-warning me-2">⭐⭐⭐⭐☆</span>
              <span>4.5 (212 reviews)</span>
            </div>
            <h4 className="product-price">
              ₹500.00{" "}
              <span className="text-muted text-decoration-line-through">
                ₹590.00
              </span>
            </h4>
            {/* Wishlist */}
            <div
              className="mb-4 product-wishlist"
              onClick={handleWishlist}
              style={{ cursor: "pointer" }}
            >
              {wishlist ? (
                <HeartFill color="red" size={22} />
              ) : (
                <Heart size={22} />
              )}{" "}
              Add to Wish List
            </div>
            {/* Pincode check */}
            <Form className="pincode-form">
              <Form.Control
                type="text"
                placeholder="000000"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="pincode-input"
              />
              <Button
                variant="link"
                className="pincode-btn"
                onClick={handleCheckPincode}
              >
                CHECK
              </Button>
            </Form>
            <small className="text-muted">{pincodeMessage}</small>
            {/* Quantity & Add to Cart */}
            <div className="d-flex align-items-center mt-4">
              <Button
                variant="light"
                onClick={() => qty > 1 && setQty(qty - 1)}
                className="px-3"
              >
                −
              </Button>
              <span className="px-3">{qty}</span>
              <Button
                variant="light"
                onClick={() => setQty(qty + 1)}
                className="px-3"
              >
                +
              </Button>
              <Button
                as={NavLink}
                to="/boxcheckout"
                className="ms-3 py-2 cart-btn font-light"
                style={{
                  backgroundColor: "#7B4B3A",
                  border: "none",
                  fontWeight: "400",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  padding: "10px 30px",
                }}
              >
                Add to Cart
              </Button>
            </div>
          </Col>
        </Row>
        <section className="py-5">
          <Container>
            {/* Tabs */}
            <Tab.Container defaultActiveKey="details">
              <Nav variant="tabs" className="mb-3 bg-color text-white p-2">
                <Nav.Item>
                  <Nav.Link eventKey="details" className="text-white nav-font">
                    Product Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="ingredients"
                    className="text-white nav-font"
                  >
                    Ingredients
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="reviews" className="text-white nav-font">
                    Reviews
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              {/* Tab Content */}
              <Tab.Content>
                {/* Product Details */}
                <Tab.Pane
                  eventKey="details"
                  className="animate_animated animate_fadeIn tab-content"
                >
                  <p>
                    Step into a realm of unparalleled off-duty style with these
                    grey acid wash joggers that effortlessly marry fashion with
                    comfort. Crafted for those committed to style even on their
                    days off, these joggers feature a chic drawstring waist and
                    a wide leg cut. The distinctive acid wash adds a touch of
                    urban edge, making these joggers a versatile choice for
                    leisurely pursuits and relaxed outings. Elevate your casual
                    wardrobe with the perfect blend of fashion-forward design
                    and comfort-driven details, redefining off-duty elegance
                    with every step.
                  </p>
                  <p>
                    Step into a realm of unparalleled off-duty style with these
                    grey acid wash joggers that effortlessly marry fashion with
                    comfort. Crafted for those committed to style even on their
                    days off, these joggers feature a chic drawstring waist and
                    a wide leg cut. The distinctive acid wash adds a touch of
                    urban edge, making these joggers a versatile choice for
                    leisurely pursuits and relaxed outings. Elevate your casual
                    wardrobe with the perfect blend of fashion-forward design
                    and comfort-driven details, redefining off-duty elegance
                    with every step.
                  </p>
                  <ul>
                    <li>Dark grey</li>
                    <li>Acid wash finish</li>
                    <li>Drawstring waist</li>
                    <li>Side slit pockets</li>
                    <li>Pin tuck pleat</li>
                    <li>Wide leg</li>
                    <li>Model is 5’9”/175cm and wears UK 10/EU 38/US 6</li>
                    <li>Product Code: 891545603</li>
                  </ul>
                </Tab.Pane>
                {/* Ingredients */}
                <Tab.Pane
                  eventKey="ingredients"
                  className="animate_animated animate_fadeIn"
                >
                  <p>Ingredient details will go here...</p>
                </Tab.Pane>
                {/* Reviews */}
                <Tab.Pane
                  eventKey="reviews"
                  className="animate_animated animate_fadeIn"
                >
                  <p>Customer reviews will go here...</p>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Container>
        </section>
        {/* Related Products */}
        <Reletedproduct />
      </Container>
    {/* FOOTER */}
      <Footer />
    </div>
  );
};
export default Productdetails;