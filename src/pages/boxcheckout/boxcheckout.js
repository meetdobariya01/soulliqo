import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Boxcheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [box, setBox] = useState(
    state.box || JSON.parse(localStorage.getItem("box") || "{}")
  );

  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    if (box && box._id) {
      localStorage.setItem("box", JSON.stringify(box));
    }
  }, [box]);

  useEffect(() => {
    setOrderTotal(box?.price || box?.boxPrice || 0);
  }, [box]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (!box?._id) {
      alert("Box details missing.");
      return;
    }

    const payload = {
      boxId: box._id,
      price: orderTotal,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/cart/custom-box`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message || "Box added to cart successfully!");
      navigate("/cart");
    } catch (err) {
      console.error("Checkout error:", err.response || err);
      alert(err.response?.data?.message || "Checkout failed.");
    }
  };

  // ✅ Only check for box, NOT chocolates
  if (!box?._id) {
    return (
      <Container className="py-5 text-center">
        <p>Box data not found.</p>
      </Container>
    );
  }

  return (
    <>
      <Header />

      <Container className="py-5">
        <h4 className="fw-semibold mb-3">Review Your Box</h4>

        <Row className="align-items-center mb-4">
          <Col md={4}>
            <img
              src={
                box.image?.[0]
                  ? `http://localhost:5000/${box.image[0]}`
                  : "https://via.placeholder.com/300"
              }
              alt={box.name}
              className="img-fluid border"
            />
          </Col>

          <Col md={8}>
            <h5>{box.name}</h5>
            <p className="text-muted">{box.weight || "100gm"}</p>
            <h4>₹{orderTotal}</h4>
          </Col>
        </Row>

        <div className="text-end">
          <Button
            style={{
              backgroundColor: "#7B4B3A",
              border: "none",
              borderRadius: "6px",
              padding: "10px 30px",
            }}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </Container>

      <Footer />
    </>
  );
};

export default Boxcheckout;
