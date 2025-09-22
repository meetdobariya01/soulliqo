import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Carousel } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

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
            <Form className="d-flex mb-2">
              <Form.Control
                type="text"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <Button
                variant="dark"
                className="ms-2"
                onClick={handleCheckPincode}
              >
                Check
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
                className="ms-3"
                style={{ backgroundColor: "#7B4B3A", border: "none" }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Productdetails;
