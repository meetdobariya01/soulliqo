import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ProgressBar,
  Breadcrumb,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const products = [
  { id: 1, name: "Sea Salt Caramel", img: "./images/wishlist.png" },
  { id: 2, name: "Milk Chocolate Ganache", img: "./images/wishlist.png" },
  { id: 3, name: "Dark Chocolate Ganache", img: "./images/wishlist.png" },
  { id: 4, name: "Classic Speculoos", img: "./images/wishlist.png" },
  { id: 5, name: "Indian Filter Coffee", img: "./images/wishlist.png" },
  { id: 6, name: "Strawberry Blush", img: "./images/wishlist.png" },
  { id: 7, name: "Cappuccino", img: "./images/wishlist.png" },
  { id: 8, name: "Tiramisu", img: "./images/wishlist.png" },
];

const MAX_LIMIT = 16;

const Boxproduct = () => {
  const [cart, setCart] = useState({});
  const totalSelected = Object.values(cart).reduce((a, b) => a + b, 0);

  const updateQuantity = (id, change) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      if (change > 0 && totalSelected >= MAX_LIMIT) return prev;
      const newQty = Math.max(0, current + change);
      return { ...prev, [id]: newQty };
    });
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Product Selection */}
      <Container fluid className="py-4 container">
        <Breadcrumb>
          <Breadcrumb.Item className="box-title" href="/ownbox">
            BUILD YOUR OWN BOX
          </Breadcrumb.Item>
          <Breadcrumb.Item className="box-header" active>
            BOX OF 16
          </Breadcrumb.Item>
        </Breadcrumb>

        <h5
          className="text-center mb-4  boxproduct-title"
          style={{ color: "#8B6F4E" }}
        >
          CHOOSE PRODUCT
        </h5>
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={6} sm={4} md={3} lg={2} className="mb-4">
              <div className="text-center">
                <img
                  src={product.img}
                  alt={product.name}
                  className="img-fluid mb-2"
                />
                <p className="small fw-semibold boxproduct-name">
                  {product.name}
                </p>
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    variant="light"
                    className="border rounded-0"
                    onClick={() => updateQuantity(product.id, -1)}
                  >
                    -
                  </Button>
                  <span
                    className="px-3 py-1 border-top border-bottom"
                    style={{ minWidth: "30px" }}
                  >
                    {cart[product.id] || 0}
                  </span>
                  <Button
                    variant="light"
                    className="border rounded-0"
                    onClick={() => updateQuantity(product.id, 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Bottom Banner */}
        {totalSelected > 0 && (
          <div
            className="position-fixed bottom-0 start-0 w-100 bg-light shadow-lg p-3 d-flex justify-content-between align-items-center bg-dark"
            style={{ zIndex: 999 }}
          >
            <div className="flex-grow-1 me-3 text-light">
              <p className="mb-1 small">
                Select up to {MAX_LIMIT} &nbsp; | &nbsp;{" "}
                <strong>{totalSelected} selected</strong>
              </p>
              <ProgressBar
                now={(totalSelected / MAX_LIMIT) * 100}
                variant="warning"
                style={{ height: "6px" }}
              />
            </div>
            <NavLink to="/boxcheckout" style={{ textDecoration: "none" }}>
              <Button
                variant="dark"
                className="px-4 py-2 rounded-0"
                style={{
                  backgroundColor: "#fff",
                  border: "none",
                  color: "#6F524C",
                }}
              >
                Review Your Order
              </Button>
            </NavLink>
          </div>
        )}
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Boxproduct;
