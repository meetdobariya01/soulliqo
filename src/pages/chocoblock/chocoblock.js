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
      <Container fluid className="p-0 container">
        {/* Banner Section */}
        <NavLink to="/chocolate-block" className="text-decoration-none">
          <div className="chocolate-banner position-relative">
            <img
              src="./images/chocolate-block.png" // replace with your banner image
              alt="Chocolate block"
              className="w-100 h-50"
            />
            <h1 className="banner-text">Chocolate block</h1>
          </div>
        </NavLink>

        {/* Product Box Section */}
        <Row className="m-0 p-4 justify-content-center">
          <Col md={6} sm={12} className="text-center">
            <NavLink
              to="/product"
              className="text-decoration-none"
            >
              <div className="product-box">
                <img
                  src="./images/chocolate-block-product.png" // replace with product image
                  alt="Center Filled Tablets"
                  className="w-50 h-50"
                />
                <div className="product-label">Center Filled Tablets</div>
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
