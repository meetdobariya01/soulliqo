import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = useMemo(() => {
    if (location.state?.cart?.items?.length > 0)
      return location.state.cart;

    const guestCart = localStorage.getItem("guestCart");
    if (guestCart) {
      try {
        const parsed = JSON.parse(guestCart);
        if (parsed?.items?.length > 0) return parsed;
      } catch {}
    }
    return { items: [] };
  }, [location.state]);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    sgst: 0,
    cgst: 0,
    total: 0,
  });

  useEffect(() => {
    if (!cart.items.length) return;

    const subtotal = cart.items.reduce((sum, item) => {
      const price = Number(item.price || item.product?.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);

    setTotals({
      subtotal,
      sgst: subtotal * 0.025,
      cgst: subtotal * 0.025,
      total: subtotal * 1.05,
    });
  }, [cart]);

  const getImage = (item) => {
    const img = item.product?.image || item.image;
    if (!img) return "";
    return img.startsWith("http")
      ? img
      : `${API_BASE_URL}/${img}`;
  };

  const handlePlaceOrder = async () => {
    if (!address.email || !address.city || !address.pincode) {
      alert("Please fill all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/orders/place`,
        {
          address,
          items: cart.items,
          totalAmount: totals.total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("guestCart");
      navigate("/orderconfrimed");
    } catch {
      alert("Order failed");
    }
  };

  if (!cart.items.length) {
    return (
      <>
        <Header />
        <Container className="py-5 text-center">
          <h5>No cart data found</h5>
          <Button as={NavLink} to="/" className="mt-3">
            RETURN TO SHOP
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-5">
        <Row>
          {/* LEFT */}
          <Col md={7}>
            <Form.Control
              className="mb-3"
              placeholder="Email"
              value={address.email}
              onChange={(e) =>
                setAddress({ ...address, email: e.target.value })
              }
            />

            <Row>
              <Col md={6}>
                <Form.Control
                  placeholder="First Name"
                  className="mb-3"
                  onChange={(e) =>
                    setAddress({ ...address, firstName: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  placeholder="Last Name"
                  className="mb-3"
                  onChange={(e) =>
                    setAddress({ ...address, lastName: e.target.value })
                  }
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  placeholder="Street"
                  className="mb-3"
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  placeholder="City"
                  className="mb-3"
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  placeholder="State"
                  className="mb-3"
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  placeholder="Pincode"
                  className="mb-3"
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                />
              </Col>
            </Row>

            <Button
              onClick={handlePlaceOrder}
              style={{ background: "#7B4B3A", border: "none" }}
            >
              PLACE ORDER
            </Button>
          </Col>

          {/* RIGHT */}
          <Col md={5}>
            {cart.items.map((item, i) => (
              <div key={i} className="d-flex mb-3">
                <img
                  src={getImage(item)}
                  alt=""
                  style={{ width: 60, height: 60 }}
                />
                <div className="ms-3">
                  <p className="mb-1">
                    {item.product?.name || item.name}
                  </p>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}

            <hr />
            <p>Subtotal: ₹{totals.subtotal.toFixed(2)}</p>
            <p>GST: ₹{(totals.sgst + totals.cgst).toFixed(2)}</p>
            <h5>Total: ₹{totals.total.toFixed(2)}</h5>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Checkout;
