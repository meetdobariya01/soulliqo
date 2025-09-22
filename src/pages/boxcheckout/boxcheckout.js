import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const cartItems = [
  {
    id: 1,
    name: "SEA SALT CARAMEL",
    qty: 9,
    img: "./images/wishlist.png",
  },
  {
    id: 2,
    name: "MILK CHOCOLATE GANACHE",
    qty: 5,
    img: "./images/wishlist.png",
  },
  {
    id: 3,
    name: "MANGO HABANERO CHILI",
    qty: 1,
    img: "./images/wishlist.png",
  },
  {
    id: 4,
    name: "HAZELNUT LATTE",
    qty: 1,
    img: "./images/wishlist.png",
  },
];

const Boxcheckout = () => {
  const orderTotal = 2000.0;
  return (
    <div>
      {/* Header */}
      <Header />

      <Container className="py-4">
        {/* Title */}
        <h5
          className="fw-semibold mb-3 boxcheckout-title"
          style={{ color: "#8B6F4E" }}
        >
          Build A Box – Chocolates
        </h5>

        {/* Subheading */}
        <p className="fw-semibold small">16-PIECE</p>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <Row key={item.id} className="align-items-center mb-3">
            <Col xs={3} sm={2}>
              <img
                src={item.img}
                alt={item.name}
                className="img-fluid border w-50"
                style={{ borderRadius: "4px" }}
              />
            </Col>
            <Col xs={9} sm={10}>
              <p className="mb-0 fw-semibold small">{item.name}</p>
              <p className="text-muted small mb-0">Qty: x{item.qty}</p>
            </Col>
          </Row>
        ))}

        {/* Divider */}
        <hr />

        {/* Order Total */}
        <Row className="align-items-center">
          <Col xs={6}>
            <p className="fw-semibold small mb-0 boxcheckout-total">
              ORDER TOTAL
            </p>
          </Col>
          <Col xs={6} className="text-end">
            <h6 className="fw-bold mb-0 display-6">₹{orderTotal.toFixed(2)}</h6>
          </Col>
        </Row>

        {/* Checkout Button */}
        <div className="text-end mt-4">
          <NavLink to="/checkout" style={{ textDecoration: "none" }}>
            <Button
              style={{
                backgroundColor: "#7B4B3A",
                border: "none",
                borderRadius: "6px",
                padding: "10px 30px",
              }}
            >
              Checkout
            </Button>
          </NavLink>
        </div>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Boxcheckout;
