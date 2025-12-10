// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
// import Footer from "../../components/footer/footer";
// import Header from "../../components/header/header";
// import { useLocation, useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [cart, setCart] = useState(
//     location.state?.cart || JSON.parse(localStorage.getItem("checkoutCart") || "{}")
//   );

//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     if (cart?.items?.length) {
//       const total = cart.items.reduce((sum, item) => {
//         const itemPrice = Number(item.price) || Number(item.product?.price) || 0;
//         const qty = Number(item.quantity) || 1;
//         return sum + itemPrice * qty;
//       }, 0);
//       setTotalAmount(total);
//     }
//   }, [cart]);

//   if (!cart?.items?.length) {
//     return (
//       <Container className="py-5 text-center">
//         <p>No cart data found. Please add items first.</p>
//       </Container>
//     );
//   }

//   const handlePlaceOrder = () => {
//     alert("Order placed successfully!");
//     localStorage.removeItem("checkoutCart");
//     navigate("/");
//   };

//   return (
//     <div>
//       <Header />
//       <Container fluid className="py-4 px-3 container">
//         <h5 className="checkout-title mb-4">CHECKOUT</h5>
//         <Row>
//           {/* LEFT SIDE - DELIVERY FORM */}
//           <Col md={7} className="mb-4">
//             <h6 className="mb-3">Contact</h6>
//             <Form.Control type="email" placeholder="Email" className="mb-4 rounded-0" />
//             <h6 className="mb-3">Delivery</h6>
//             <Row>
//               <Col md={12} className="mb-3">
//                 <Form.Select className="rounded-0">
//                   <option>Country/Region</option>
//                   <option>India</option>
//                 </Form.Select>
//               </Col>
//               <Col md={6} className="mb-3">
//                 <Form.Control type="text" placeholder="First Name" />
//               </Col>
//               <Col md={6} className="mb-3">
//                 <Form.Control type="text" placeholder="Last Name" />
//               </Col>
//               <Col md={12} className="mb-3">
//                 <Form.Control type="text" placeholder="Address" />
//               </Col>
//               <Col md={6} className="mb-3">
//                 <Form.Control type="text" placeholder="City" />
//               </Col>
//               <Col md={3} className="mb-3">
//                 <Form.Control type="text" placeholder="State" />
//               </Col>
//               <Col md={3} className="mb-3">
//                 <Form.Control type="text" placeholder="Pincode" />
//               </Col>
//             </Row>

//             <Form.Check
//               type="checkbox"
//               label="Save this information for next time"
//               className="mb-4"
//             />

//             <h6 className="mb-3">Payment</h6>
//             <Card className="mb-4">
//               <Card.Body>
//                 <img
//                   src="./images/payment.jpg"
//                   alt="payment options"
//                   className="img-fluid mb-2"
//                 />
//                 <p className="small mb-0">
//                   You’ll be redirected to Razorpay to complete payment securely.
//                 </p>
//               </Card.Body>
//             </Card>

//             <div className="mt-4">
//               <Button
//                 style={{
//                   backgroundColor: "#7B4B3A",
//                   border: "none",
//                   borderRadius: "6px",
//                   padding: "12px 40px",
//                 }}
//                 onClick={handlePlaceOrder}
//               >
//                 PLACE ORDER
//               </Button>
//             </div>
//           </Col>

//           {/* RIGHT SIDE - ORDER SUMMARY */}
//           <Col md={5}>
//             <Card className="mb-3">
//               <Card.Body>
//                 <h6 className="fw-semibold small mb-2">Available Offers</h6>
//                 <p className="small mb-0">
//                   10% Instant Discount on RBL Bank Credit Card and Credit Card EMI
//                   on a min spend of ₹3,500.
//                 </p>
//               </Card.Body>
//             </Card>

//             <h6 className="fw-semibold mb-3">ORDER SUMMARY</h6>
//             {cart.items.map((item, index) => (
//               <Card className="mb-2 rounded-0" key={index}>
//                 <Card.Body className="d-flex align-items-start">
//                   <img
//                     src={
//                       item.product?.image ||
//                       item.box?.image ||
//                       "./images/product-grid.png"
//                     }
//                     alt={item.product?.name || item.name || "Custom Box"}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "4px",
//                     }}
//                     className="me-3"
//                   />
//                   <div className="flex-grow-1">
//                     <p className="mb-1 small fw-semibold">
//                       {item.product?.name || item.name || "Custom Box"}
//                     </p>
//                     {item.type === "box" && (
//                       <ul className="small mb-1 ps-3">
//                         {item.products?.map((p, idx) => (
//                           <li key={idx}>
//                             {p.chocolate?.name} × {p.quantity}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                     <p className="mb-1 small text-muted">
//                       Qty: {item.quantity || 1}
//                     </p>
//                     <p className="small fw-semibold">
//                       ₹{(item.price || item.product?.price || 0).toFixed(2)}
//                     </p>
//                   </div>
//                 </Card.Body>
//               </Card>
//             ))}

//             <hr />
//             <div className="d-flex justify-content-between fw-semibold">
//               <span>Total Amount</span>
//               <span>₹{totalAmount.toFixed(2)}</span>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//       <Footer />
//     </div>
//   );
// };

// export default Checkout;
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart] = useState(
    location.state?.cart || JSON.parse(localStorage.getItem("checkoutCart") || "{}")
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

  // ✅ Calculate totals with tax
  useEffect(() => {
    if (cart?.items?.length) {
      const sub = cart.items.reduce((sum, item) => {
        const price = Number(item.price) || Number(item.product?.price) || 0;
        const qty = Number(item.quantity) || 1;
        return sum + price * qty;
      }, 0);

      const sgstVal = sub * 0.025;
      const cgstVal = sub * 0.025;
      const total = sub + sgstVal + cgstVal;

      setSubtotal(sub);
      setSgst(sgstVal);
      setCgst(cgstVal);
      setTotalAmount(total);
    }
  }, [cart]);

  if (!cart?.items?.length) {
    return (
      <Container className="py-5 text-center">
        <p>No cart data found. Please add items first.</p>
      </Container>
    );
  }

  // ✅ Handle multiple image types
  const getImageList = (item) => {
    const rawImage =
      item.image || item.product?.image || item.box?.image || [];

    if (Array.isArray(rawImage)) {
      return rawImage
        .flatMap((img) => img.split(",").map((i) => i.trim()))
        .filter(Boolean)
        .map((img) => (img.startsWith("http") ? img : `${API_BASE_URL}${img}`));
    }

    if (typeof rawImage === "string") {
      return rawImage
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean)
        .map((img) => (img.startsWith("http") ? img : `${API_BASE_URL}${img}`));
    }

    return [`${API_BASE_URL}/images/product-grid.png`];
  };

  const handlePlaceOrder = async () => {
    if (!address.city || !address.pincode || !address.email) {
      alert("Please enter city, pincode, and email before placing order.");
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
      console.error("Order placement failed:", err);
      alert(err.response?.data?.message || "❌ Failed to place order. Try again.");
    }
  };

  return (
    <div>
      <Header />
      <Container fluid className="py-4 px-3 container">
        <h5 className="checkout-title mb-4">CHECKOUT</h5>
        <Row>
          {/* LEFT: Address + Payment */}
          <Col md={7} className="mb-4">
            <h6 className="mb-3">Contact</h6>
            <Form.Control
              type="email"
              placeholder="Email"
              className="mb-4 rounded-0"
              value={address.email}
              onChange={(e) => setAddress({ ...address, email: e.target.value })}
            />

            <h6 className="mb-3">Delivery</h6>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Select
                  className="rounded-0"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                >
                  <option>India</option>
                </Form.Select>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={address.firstName}
                  onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  value={address.lastName}
                  onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </Col>

              <Col md={3} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </Col>

              <Col md={3} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                />
              </Col>
            </Row>

            <h6 className="mb-3">Payment</h6>
            <Card className="mb-4">
              <Card.Body>
                <img
                  src="./images/payment.jpg"
                  alt="payment"
                  className="img-fluid mb-2"
                />
                <p className="small mb-0">
                  You’ll be redirected to Razorpay to complete payment securely.
                </p>
              </Card.Body>
            </Card>

            <div className="mt-4">
              <Button
                as={NavLink}
                to="/orderconfrimed"
                style={{
                  backgroundColor: "#7B4B3A",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px 40px",
                  color: "#fff",
                  fontWeight: "500",
                  fontFamily: "Poppins",
                  textDecoration: "none",
                }}
                onClick={handlePlaceOrder}
              >
                PLACE ORDER
              </Button>
            </div>
          </Col>

          {/* RIGHT: ORDER SUMMARY */}
          <Col md={5}>
            <Card className="mb-3">
              <Card.Body>
                <h6 className="fw-semibold small mb-2">Available Offers</h6>
                <p className="small mb-0">
                  10% Instant Discount on RBL Bank Credit Card and Credit Card EMI on a
                  min spend of ₹3,500.
                </p>
              </Card.Body>
            </Card>

            <h6 className="fw-semibold mb-3">ORDER SUMMARY</h6>
            {cart.items.map((item, index) => {
              const images = getImageList(item);
              return (
                <Card className="mb-2 rounded-0" key={index}>
                  <Card.Body className="d-flex align-items-start">
                    <div className="d-flex">
                      {images.slice(0, 2).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={item.product?.name || item.name || "Custom Box"}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginRight: "4px",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="mb-1 small fw-semibold">
                        {item.product?.name || item.name || "Custom Box"}
                      </p>
                      <p className="mb-1 small text-muted">Qty: {item.quantity || 1}</p>
                      <p className="small fw-semibold">
                        ₹{(item.price || item.product?.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}

            <hr />
            <div className="d-flex justify-content-between small text-muted">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small text-muted">
              <span>SGST (2.5%)</span>
              <span>₹{sgst.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between small text-muted mb-2">
              <span>CGST (2.5%)</span>
              <span>₹{cgst.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-semibold">
              <span>Total (Incl. Taxes)</span>
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
