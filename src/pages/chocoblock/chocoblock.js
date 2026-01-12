import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Chocoblock = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Banner Section */}
      <NavLink to="" className="text-decoration-none">
        <div className="chocolate-banner position-relative">
          <img
            src="./images/ColageBar_imresizer.webp" // replace with your banner image
            alt="Chocolate block"
            className="w-100 h-50"
          />
          <h1 className="banner-text text-uppercase figtree-font ">
            Chocolate block
          </h1>
        </div>
      </NavLink>

      {/* Product Box Section */}
      <Container fluid className="p-0 container">
        <Row className="m-0 p-4 justify-content-center">
          <Col md={6} sm={12} className="text-center border">
            <NavLink
              to={`/products/${encodeURIComponent("CENTERFILLED TABLET")}`}
              className="text-decoration-none"
            >
              <div className="product-box">
                <img
                  src="./images/chocolate-block-product.png"
                  alt="Center Filled Tablets"
                  className="w-50 h-50"
                />
                <div className="shop-now-btn">Shop Now</div>
              </div>
            </NavLink>

          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Chocoblock;
