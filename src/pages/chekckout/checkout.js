import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart] = useState(
    location.state?.cart ||
      JSON.parse(localStorage.getItem("checkoutCart") || "{}")
  );

  const [address, setAddress] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
  });

  const [subtotal, setSubtotal] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // ✅ Calculate totals
  useEffect(() => {
    if (cart?.items?.length) {
      const sub = cart.items.reduce((sum, item) => {
        const price =
          Number(item.price) ||
          Number(item.product?.price) ||
          Number(item.box?.price) ||
          0;
        const qty = Number(item.quantity) || 1;
        return sum + price * qty;
      }, 0);

      const sgstVal = sub * 0.025;
      const cgstVal = sub * 0.025;

      setSubtotal(sub);
      setSgst(sgstVal);
      setCgst(cgstVal);
      setTotalAmount(sub + sgstVal + cgstVal);
    }
  }, [cart]);

  if (!cart?.items?.length) {
    return (
      <Container className="py-5 text-center">
        <p>No cart data found. Please add items first.</p>
      </Container>
    );
  }

  // ✅ Image handler (product + box)
  const getImageList = (item) => {
    const rawImage =
      item.product?.image ||
      item.product?.images ||
      item.box?.image ||
      item.image;

    if (!rawImage) {
      return [`${API_BASE_URL}/images/product-grid.png`];
    }

    const images = Array.isArray(rawImage)
      ? rawImage
      : rawImage.split(",");

    return images.map((img) =>
      img.startsWith("http")
        ? img
        : `${API_BASE_URL}/${img.replace(/^\/+/, "")}`
    );
  };

  const handlePlaceOrder = async () => {
    if (!address.city || !address.pincode || !address.email) {
      alert("Please enter city, pincode, and email.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/orders/place`,
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Order placed successfully!");
      localStorage.removeItem("checkoutCart");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Order failed");
    }
  };

  return (
    <div>
      <Header />
      <Container fluid className="py-4 px-3 container">
        <h5 className="checkout-title mb-4">CHECKOUT</h5>
        <Row>
          {/* LEFT */}
          <Col md={7}>
            <h6 className="mb-3">Contact</h6>
            <Form.Control
              type="email"
              placeholder="Email"
              className="mb-4"
              value={address.email}
              onChange={(e) =>
                setAddress({ ...address, email: e.target.value })
              }
            />

            <h6 className="mb-3">Delivery</h6>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Control
                  placeholder="First Name"
                  value={address.firstName}
                  onChange={(e) =>
                    setAddress({ ...address, firstName: e.target.value })
                  }
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  placeholder="Last Name"
                  value={address.lastName}
                  onChange={(e) =>
                    setAddress({ ...address, lastName: e.target.value })
                  }
                />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Control
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Button
              as={NavLink}
              to="/orderconfrimed"
              onClick={handlePlaceOrder}
              style={{
                backgroundColor: "#7B4B3A",
                border: "none",
                padding: "12px 40px",
              }}
            >
              PLACE ORDER
            </Button>
          </Col>

          {/* RIGHT */}
          <Col md={5}>
            <h6 className="fw-semibold mb-3">ORDER SUMMARY</h6>

            {cart.items.map((item, index) => {
              const images = getImageList(item);
              return (
                <Card key={index} className="mb-2">
                  <Card.Body className="d-flex">
                    <img
                      src={images[0]}
                      alt={
                        item.product?.name ||
                        item.box?.boxName ||
                        "Custom Box"
                      }
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />

                    <div className="ms-3 flex-grow-1">
                      <p className="mb-1 fw-semibold small">
                        {item.product?.name ||
                          item.box?.boxName ||
                          "Custom Box"}
                      </p>
                      <p className="small text-muted mb-1">
                        Qty: {item.quantity || 1}
                      </p>
                      <p className="fw-semibold small">
                        ₹
                        {(
                          item.price ||
                          item.product?.price ||
                          item.box?.price ||
                          0
                        ).toFixed(2)}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>SGST</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>CGST</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Checkout;
