import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";
const ADMIN_API_BASE = "https://admin.soulliqo.com";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // -----------------------------
  // Cart and Boxes state
  // -----------------------------
  const [cart, setCart] = useState(() => {
    if (location.state?.cart?.items?.length > 0) return location.state.cart;
    if (Array.isArray(location.state?.cart)) return { items: location.state.cart };

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
  });

  const [boxes, setBoxes] = useState(() => {
    if (Array.isArray(location.state?.boxes)) return location.state.boxes;
    const localBoxes = localStorage.getItem("boxes");
    return localBoxes ? JSON.parse(localBoxes) : [];
  });

  // -----------------------------
  // Address and subtotal state
  // -----------------------------
  const [address, setAddress] = useState({
    firstName: "", lastName: "", street: "", city: "", state: "", pincode: "", email: "" ,mobile: ""
  });

  const [subtotal, setSubtotal] = useState(0);

  // -----------------------------
  // Calculate subtotal
  // -----------------------------
  useEffect(() => {
    const itemsTotal = cart.items?.reduce((sum, item) => {
      const price = Number(item.price || item.product?.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0) || 0;

    const boxesTotal = boxes?.reduce((sum, box) => sum + Number(box.price || 0), 0) || 0;

    setSubtotal(itemsTotal + boxesTotal);
  }, [cart, boxes]);

  // -----------------------------
  // Admin Image resolver
  // -----------------------------
  const resolveImageUrl = (imgField) => {
    if (!imgField || (Array.isArray(imgField) && imgField.length === 0)) return "/images/product-grid.png";

    let imagePath = Array.isArray(imgField) ? imgField[0] : imgField;

    if (typeof imagePath === "string" && imagePath.includes(",")) {
      imagePath = imagePath.split(",")[0].trim();
    }

    if (typeof imagePath !== "string") return "/images/product-grid.png";

    const normalizedPath = imagePath.startsWith("/") ? imagePath : "/" + imagePath;

    if (normalizedPath.startsWith("/uploads")) return `${ADMIN_API_BASE}${normalizedPath}`;
    if (normalizedPath.startsWith("/images")) return `${normalizedPath}`;

    return imagePath;
  };

  const getItemImage = (item) => {
    if (item.product) return resolveImageUrl(item.product.image || item.product.images);
    if (item.image) return resolveImageUrl(item.image);
    return "/images/product-grid.png";
  };

  // -----------------------------
  // Place order with Razorpay
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!address.email || !address.city || !address.pincode) {
      alert("Fill address");
      return;
    }

    const token = localStorage.getItem("token");
    const isGuest = !token;

    try {
      // 1️⃣ Create payment
      const paymentRes = await axios.post(
        `${API_BASE_URL}/orders/create-payment`,
        { amount: subtotal }
      );

      const { key, order } = paymentRes.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Soulliqo",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 2️⃣ Verify payment
            await axios.post(`${API_BASE_URL}/orders/verify-payment`, response);

            // 3️⃣ Place order
            await axios.post(
              isGuest
                ? `${API_BASE_URL}/orders/place-guest-paid`
                : `${API_BASE_URL}/orders/place`,
              {
                address,
                items: cart.items,
                boxes,
                payment: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              },
              token ? { headers: { Authorization: `Bearer ${token}` } } : {}
            );

            // 4️⃣ Clear localStorage and state
            localStorage.removeItem("guestCart");
            localStorage.removeItem("boxes");
            setCart({ items: [] });
            setBoxes([]);

            navigate("/orderconfrimed");
          } catch (err) {
            console.error(err);
            alert("Payment or order placement failed");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  // -----------------------------
  // Empty cart handling
  // -----------------------------
  if ((!cart.items || cart.items.length === 0) && boxes.length === 0) {
    return (
      <>
        <Header />
        <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
          <h4 className="mt-5 text-muted">No cart data found. Please add items first.</h4>
          <Button as={NavLink} to="/" className="mt-3" style={{ backgroundColor: "#7B4B3A", border: "none" }}>
            RETURN TO SHOP
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  // -----------------------------
  // Main render
  // -----------------------------
  return (
    <div>
      <Header />
      <Container className="py-5">
        <h4 className="mb-5 fw-bold fs-3 montserrat-font">CHECKOUT</h4>
        <Row>
          <Col md={7}>
            {/* Contact */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase small mb-3 montserrat-font">Contact</h6>
              <Form.Control
                className="figtree-font"
                type="email"
                placeholder="Email"
                onChange={e => setAddress({ ...address, email: e.target.value })}
              />
              <Form.Control
                className="figtree-font mt-2"
                type="tel"
                placeholder="Mobile"
                onChange={e => setAddress({ ...address, mobile: e.target.value })}
              />
            </div>

            {/* Delivery */}
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase small mb-3 montserrat-font">Delivery</h6>
              <Row className="figtree-font">
                <Col md={6} className="mb-3">
                  <Form.Control placeholder="First Name" onChange={e => setAddress({ ...address, firstName: e.target.value })} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control placeholder="Last Name" onChange={e => setAddress({ ...address, lastName: e.target.value })} />
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Control placeholder="Street" onChange={e => setAddress({ ...address, street: e.target.value })} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Control placeholder="City" onChange={e => setAddress({ ...address, city: e.target.value })} />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Control placeholder="State" onChange={e => setAddress({ ...address, state: e.target.value })} />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Control placeholder="Pincode" onChange={e => setAddress({ ...address, pincode: e.target.value })} />
                </Col>
              </Row>
            </div>

            <Button
              onClick={handlePlaceOrder}
              className="py-2 px-5 border-0"
              style={{ backgroundColor: "#312526", fontFamily: "Montserrat", letterSpacing: "1px" }}
            >
              PLACE ORDER
            </Button>
          </Col>

          {/* Order Summary */}
          <Col md={5} className="ps-md-5">
            <h6 className="fw-bold text-uppercase small mb-4 montserrat-font">Order Summary</h6>
            <div className="pe-2" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {cart.items.map((item, idx) => (
                <div key={`item-${idx}`} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={getItemImage(item)}
                    alt={item.product?.name || "Item"}
                    style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <div className="ms-3 flex-grow-1">
                    <p className="mb-0 fw-bold small montserrat-font">{item.product?.name || item.name || "Item"}</p>
                    <p className="mb-0 text-muted extra-small figtree-font">Qty: {item.quantity}</p>
                    <p className="mb-0 fw-bold small figtree-font">₹{(Number(item.price || item.product?.price || 0)).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              {boxes.length > 0 && boxes.map((box, idx) => (
                <div key={`box-${idx}`} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={resolveImageUrl(box.selectedChocolates[0]?.img)}
                    alt={box.size + " Box"}
                    style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <div className="ms-3 flex-grow-1">
                    <p className="mb-0 fw-bold small montserrat-font">{box.size}-PIECE BOX</p>
                    <p className="mb-0 text-muted extra-small figtree-font">
                      {box.selectedChocolates.map(c => `${c.name} x${c.qty}`).join(", ")}
                    </p>
                    <p className="mb-0 fw-bold small figtree-font">₹{Number(box.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2 small fs-4">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-4">Total</span>
                <span className="fw-bold fs-4">₹{subtotal.toFixed(2)}</span>
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
