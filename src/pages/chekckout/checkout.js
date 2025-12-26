import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 1. Improved Data Detection (Fixes "No cart data found" from your image)
  const cart = useMemo(() => {
    // Check navigation state
    if (location.state?.cart?.items?.length > 0) return location.state.cart;
    if (Array.isArray(location.state?.cart)) return { items: location.state.cart };

    // Check localStorage (guestCart)
    const guestCart = localStorage.getItem("guestCart");
    if (guestCart) {
      try {
        const parsed = JSON.parse(guestCart);
        const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
        if (items.length > 0) return { items };
      } catch (e) {
        console.error("Error parsing guestCart", e);
      }
    }
    return { items: [] };
  }, [location.state]);

  const [address, setAddress] = useState({
    firstName: "", lastName: "", street: "", city: "", state: "", pincode: "", email: ""
  });

  const [totals, setTotals] = useState({ subtotal: 0, sgst: 0, cgst: 0, total: 0 });

  useEffect(() => {
    if (cart?.items?.length > 0) {
      const sub = cart.items.reduce((sum, item) => {
        const price = Number(item.price || item.product?.price || 0);
        const qty = Number(item.quantity || 1);
        return sum + (price * qty);
      }, 0);

      setTotals({
        subtotal: sub,
        sgst: sub * 0.025,
        cgst: sub * 0.025,
        total: sub + (sub * 0.05)
      });
    }
  }, [cart]);

  // ✅ 2. Image Fix (Fixes the broken image in image_e11da1.png)
  const getSingleImage = (item) => {
    const target = item.product || item;
    const imageField = target.image || target.images || "";
    
    if (!imageField) return "";

    let rawPaths = [];
    if (Array.isArray(imageField)) {
      rawPaths = imageField.flatMap(img => typeof img === 'string' ? img.split(",") : img);
    } else {
      rawPaths = imageField.split(",");
    }

    const firstPath = rawPaths.map(p => p.trim()).filter(Boolean)[0];
    if (!firstPath) return "";

    return firstPath.startsWith("http") 
      ? firstPath 
      : `${API_BASE_URL}${firstPath.startsWith("/") ? "" : "/"}${firstPath}`;
  };
  // const handlePlaceOrder = async () => {
  //   if (!address.email || !address.city || !address.pincode) {
  //     alert("Please fill in Email, City, and Pincode.");
  //     return;
  //   }

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     alert("Please log in to complete order.");
  //     navigate("/login", { state: { from: "/checkout", cart: cart } });
  //     return;
  //   }

  //   try {
  //     await axios.post(`${API_BASE_URL}/orders/place`, 
  //       { address, items: cart.items, totalAmount: totals.total },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     alert("Order Placed!");
  //     localStorage.removeItem("guestCart");
  //     navigate("/orderconfrimed");
  //   } catch (err) {
  //     alert("Order failed. Please try again.");
  //   }
  // };
const handlePlaceOrder = async () => {
    // 1. Validation
    if (!address.email || !address.city || !address.pincode || !address.firstName || !address.street) {
      alert("Please fill in all required delivery details.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to complete order.");
      navigate("/login", { state: { from: "/checkout", cart: cart } });
      return;
    }

    try {
      // 2. Prepare Payload
      // Note: Make sure the keys (firstName, street, etc.) match exactly what your Backend expects
      const orderPayload = {
        address: address,
        items: cart.items.map(item => ({
          product: item.product?._id || item.productId,
          name: item.product?.name || item.name,
          price: item.price || item.product?.price,
          quantity: item.quantity
        })),
        subtotal: totals.subtotal,
        sgst: totals.sgst,
        cgst: totals.cgst,
        totalAmount: totals.total
      };

      // 3. API Call
      const res = await axios.post(`${API_BASE_URL}/orders/place`, 
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 4. Success Handling
      if (res.status === 201 || res.status === 200) {
        // Clear guest cart as order is successful
        localStorage.removeItem("guestCart");

        // ✅ IMPORTANT: Pass the server response (res.data) to the next page
        navigate("/orderconfrimed", { state: { order: res.data } });
      }
    } catch (err) {
      console.error("Order error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Order failed. Please try again.");
    }
  };
  // ✅ 3. Empty State UI
  if (!cart.items || cart.items.length === 0) {
    return (
      <>
        <Header />
        <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
          <h4 className="mt-5 text-muted">No cart data found. Please add items first.</h4>
          <Button as={NavLink} to="/" className="mt-3" style={{backgroundColor: "#7B4B3A", border: "none"}}>
            RETURN TO SHOP
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Header />
      <Container className="py-5">
        <h4 className="mb-5 fw-bold">CHECKOUT</h4>
        <Row>
          <Col md={7}>
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase small mb-3">Contact</h6>
              <Form.Control 
                type="email" 
                placeholder="Email" 
                onChange={e => setAddress({...address, email: e.target.value})} 
              />
            </div>
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase small mb-3">Delivery</h6>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Control placeholder="First Name" onChange={e => setAddress({...address, firstName: e.target.value})} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control placeholder="Last Name" onChange={e => setAddress({...address, lastName: e.target.value})} />
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Control placeholder="Street" onChange={e => setAddress({...address, street: e.target.value})} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control placeholder="City" onChange={e => setAddress({...address, city: e.target.value})} />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Control placeholder="State" onChange={e => setAddress({...address, state: e.target.value})} />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Control placeholder="Pincode" onChange={e => setAddress({...address, pincode: e.target.value})} />
                </Col>
              </Row>
            </div>
            <Button onClick={handlePlaceOrder} className="py-2 px-5 border-0" style={{ backgroundColor: "#7B4B3A" }}>
              PLACE ORDER
            </Button>
          </Col>

          <Col md={5} className="ps-md-5">
            <h6 className="fw-bold text-uppercase small mb-4">Order Summary</h6>
            <div className="pe-2" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {cart.items.map((item, idx) => (
                <div key={idx} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img 
                    src={getSingleImage(item)} 
                    alt="item" 
                    style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "8px" }} 
                  />
                  <div className="ms-3 flex-grow-1">
                    <p className="mb-0 fw-bold small">{item.product?.name || item.name || "Item"}</p>
                    <p className="mb-0 text-muted extra-small">Qty: {item.quantity}</p>
                    <p className="mb-0 fw-bold small">₹{(Number(item.price || item.product?.price || 0)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2 small">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small">
                <span>GST (5%)</span>
                <span>₹{(totals.sgst + totals.cgst).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Checkout;
