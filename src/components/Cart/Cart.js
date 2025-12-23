import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to view your cart.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data || { items: [] });
      } catch (err) {
        console.error("Cart fetch error:", err);
        alert("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="secondary" />
      </div>
    );

  if (!cart || !cart.items?.length)
    return (
      <Container className="py-5 text-center">
        <p>Your cart is empty.</p>
        <NavLink to="/" className="btn btn-outline-secondary">
          Go Shopping
        </NavLink>
      </Container>
    );

  // ✅ Image helper
  const getImageUrl = (item) => {
    const rawImage =
      item.product?.image ||
      item.product?.images ||
      item.box?.image ||
      item.image;

    if (!rawImage) return `${API_BASE_URL}/images/product-grid.png`;

    const img = Array.isArray(rawImage) ? rawImage[0] : rawImage.split(",")[0];

    return img.startsWith("http")
      ? img
      : `${API_BASE_URL}/${img.replace(/^\/+/, "")}`;
  };

  const orderTotal = (cart.items || []).reduce((acc, i) => {
    const price =
      Number(i.price) ||
      Number(i.product?.price) ||
      Number(i.box?.price) ||
      0;
    const qty = Number(i.quantity) || 1;
    return acc + price * qty;
  }, 0);

  const handleCheckout = () => {
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div>
      <Header />
      <Container className="py-4">
        <h5 className="fw-semibold mb-3" style={{ color: "#8B6F4E" }}>
          Your Cart
        </h5>

        {(cart.items || []).map((item, index) => (
          <Row key={index} className="align-items-center mb-3">
            <Col xs={3} sm={2}>
              <img
                src={getImageUrl(item)}
                alt={
                  item.product?.name ||
                  item.box?.boxName ||
                  "Custom Box"
                }
                className="img-fluid border"
                style={{ borderRadius: "6px" }}
                onError={(e) => {
                  e.target.src = `${API_BASE_URL}/images/product-grid.png`;
                }}
              />
            </Col>

            <Col xs={9} sm={10}>
              <p className="fw-semibold small mb-0">
                {item.product?.name ||
                  item.box?.boxName ||
                  "Custom Box"}
              </p>

              <p className="text-muted small mb-0">
                Qty: {item.quantity || 1}
              </p>

              {/* ✅ Show chocolates inside box */}
              {item.type === "box" && item.products?.length > 0 && (
                <ul className="small mb-1 ps-3">
                  {item.products.map((p, idx) => (
                    <li key={idx}>
                      {p.chocolate?.name} × {p.quantity}
                    </li>
                  ))}
                </ul>
              )}

              <p className="fw-semibold small mb-0">
                ₹
                {(
                  item.price ||
                  item.product?.price ||
                  item.box?.price ||
                  0
                ).toFixed(2)}
              </p>
            </Col>
          </Row>
        ))}

        <hr />

        <Row>
          <Col xs={6}>
            <p className="fw-semibold small mb-0">ORDER TOTAL</p>
          </Col>
          <Col xs={6} className="text-end">
            <h6 className="fw-bold mb-0">₹{orderTotal.toFixed(2)}</h6>
          </Col>
        </Row>

        <div className="text-end mt-4">
          <Button
            onClick={handleCheckout}
            style={{
              backgroundColor: "#7B4B3A",
              border: "none",
              borderRadius: "6px",
              padding: "10px 30px",
            }}
          >
            Checkout
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Cart;
