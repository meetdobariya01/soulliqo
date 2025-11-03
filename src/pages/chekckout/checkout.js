// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
// import Footer from "../../components/footer/footer";
// import Header from "../../components/header/header";
// import { useLocation, useNavigate } from "react-router-dom";

// const Checkout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // recover passed state or from localStorage
//   const state = location.state || {};
//   const [box, setBox] = useState(
//     state.box || JSON.parse(localStorage.getItem("box") || "{}")
//   );
//   const [selectedChocolates, setSelectedChocolates] = useState(
//     state.selectedChocolates ||
//       JSON.parse(localStorage.getItem("selectedChocolates") || "[]")
//   );

//   // calculate total (box price only)
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     if (box?.price) {
//       setTotalAmount(box.price);
//     } else {
//       setTotalAmount(0);
//     }
//   }, [box]);

//   if (!box?._id) {
//     return (
//       <Container className="py-5 text-center">
//         <p>No box data found. Please select your chocolates first.</p>
//       </Container>
//     );
//   }

//   const handlePlaceOrder = () => {
//     alert("Order placed successfully!");

//     // ✅ Clear all box/cart data from localStorage
//     localStorage.removeItem("cart");
//     localStorage.removeItem("box");
//     localStorage.removeItem("selectedChocolates");

//     // ✅ Clear local React states
//     setBox({});
//     setSelectedChocolates([]);
//     setTotalAmount(0);

//     // ✅ Redirect to home or thank-you page
//     navigate("/");
//   };

//   return (
//     <div>
//       <Header />
//       <Container fluid className="py-4 px-3 container">
//         <h5 className="checkout-title mb-4">CHECKOUT</h5>
//         <Row>
//           {/* LEFT SIDE - DELIVERY FORM */}
//           <Col md={7} className="mb-4 checkout-main-font">
//             <h6 className="mb-3 checkout-form">Contact</h6>
//             <Form.Control
//               type="email"
//               placeholder="Email"
//               className="mb-4 rounded-0"
//             />

//             <h6 className="checkout-form mb-3">Delivery</h6>
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

//             <h6 className="checkout-form mb-3">Payment</h6>
//             <p className="text-muted small">
//               All transactions are secure and encrypted.
//             </p>
//             <Card className="mb-4">
//               <Card.Body>
//                 <img
//                   src="./images/payment.jpg"
//                   alt="payment options"
//                   className="img-fluid mb-2"
//                 />
//                 <p className="small mb-0">
//                   After clicking "Pay now", you will be redirected to Razorpay
//                   Secure (UPI, Cards, Wallets, NetBanking) to complete your
//                   purchase securely.
//                 </p>
//               </Card.Body>
//             </Card>

//             <h6 className="checkout-form mb-3">Billing address</h6>
//             <Form.Check
//               type="radio"
//               name="billing"
//               label="Same as shipping address"
//               defaultChecked
//             />
//             <Form.Check
//               type="radio"
//               name="billing"
//               label="Use a different billing address"
//             />

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

//           {/* RIGHT SIDE - SUMMARY */}
//           <Col md={5}>
//             <Card className="mb-3">
//               <Card.Body>
//                 <h6 className="fw-semibold small mb-2">Available Offers</h6>
//                 <p className="small mb-0">
//                   10% Instant Discount on RBL Bank Credit Card and Credit Card
//                   EMI on a min spend of ₹3,500.
//                 </p>
//               </Card.Body>
//             </Card>

//             <h6 className="fw-semibold mb-3">
//               {box.size}-PIECE BOX ({selectedChocolates.length} Chocolates)
//             </h6>

//             {selectedChocolates.map((item) => (
//               <Card className="mb-2 rounded-0" key={item.id}>
//                 <Card.Body className="d-flex align-items-center">
//                   <img
//                     src={item.img || "./images/product-grid.png"}
//                     alt={item.name}
//                     style={{
//                       width: "60px",
//                       height: "60px",
//                       objectFit: "cover",
//                       borderRadius: "4px",
//                     }}
//                     className="me-3"
//                   />
//                   <div className="flex-grow-1">
//                     <p className="mb-1 small fw-semibold">{item.name}</p>
//                     <p className="mb-1 small text-muted">Qty: {item.qty}</p>
//                   </div>
//                 </Card.Body>
//               </Card>
//             ))}

//             <div className="d-flex my-3">
//               <Form.Control
//                 type="text"
//                 placeholder="Gift Voucher Code"
//                 className="rounded-0 me-2"
//               />
//               <Button
//                 style={{ backgroundColor: "#7B4B3A", border: "none" }}
//                 className="rounded-0"
//               >
//                 Apply
//               </Button>
//             </div>

//             <h6 className="fw-semibold mb-3">PRICE DETAILS</h6>
//             <div className="d-flex justify-content-between small mb-1">
//               <span>Box Price</span>
//               <span>₹{box.price?.toFixed(2) || "0.00"}</span>
//             </div>
//             <div className="d-flex justify-content-between small mb-1">
//               <span>Shipping Fee</span>
//               <span className="text-success">FREE</span>
//             </div>
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
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // recover passed state or from localStorage
  const state = location.state || {};
  const [box, setBox] = useState(
    state.box || JSON.parse(localStorage.getItem("box") || "{}")
  );
  const [selectedChocolates, setSelectedChocolates] = useState(
    state.selectedChocolates ||
      JSON.parse(localStorage.getItem("selectedChocolates") || "[]")
  );

  // calculate total (box price + product prices)
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    let total = 0;

    // add box price
    if (box?.price) total += box.price;

    // add product prices * quantity
    if (Array.isArray(selectedChocolates)) {
      selectedChocolates.forEach((item) => {
        const price = parseFloat(item.price || box.price || 0); // fallback if product price missing
        total += price * (item.qty || 1);
      });
    }

    setTotalAmount(total);
  }, [box, selectedChocolates]);

  if (!box?._id) {
    return (
      <Container className="py-5 text-center">
        <p>No box data found. Please select your chocolates first.</p>
      </Container>
    );
  }

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");

    // ✅ Clear all box/cart data from localStorage
    localStorage.removeItem("cart");
    localStorage.removeItem("box");
    localStorage.removeItem("selectedChocolates");

    // ✅ Clear local React states
    setBox({});
    setSelectedChocolates([]);
    setTotalAmount(0);

    // ✅ Redirect to home or thank-you page
    navigate("/");
  };

  return (
    <div>
      <Header />
      <Container fluid className="py-4 px-3 container">
        <h5 className="checkout-title mb-4">CHECKOUT</h5>
        <Row>
          {/* LEFT SIDE - DELIVERY FORM */}
          <Col md={7} className="mb-4 checkout-main-font">
            <h6 className="mb-3 checkout-form">Contact</h6>
            <Form.Control
              type="email"
              placeholder="Email"
              className="mb-4 rounded-0"
            />

            <h6 className="checkout-form mb-3">Delivery</h6>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Select className="rounded-0">
                  <option>Country/Region</option>
                  <option>India</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control type="text" placeholder="First Name" />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control type="text" placeholder="Last Name" />
              </Col>
              <Col md={12} className="mb-3">
                <Form.Control type="text" placeholder="Address" />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control type="text" placeholder="City" />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control type="text" placeholder="State" />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control type="text" placeholder="Pincode" />
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              label="Save this information for next time"
              className="mb-4"
            />

            <h6 className="checkout-form mb-3">Payment</h6>
            <p className="text-muted small">
              All transactions are secure and encrypted.
            </p>
            <Card className="mb-4">
              <Card.Body>
                <img
                  src="./images/payment.jpg"
                  alt="payment options"
                  className="img-fluid mb-2"
                />
                <p className="small mb-0">
                  After clicking "Pay now", you will be redirected to Razorpay
                  Secure (UPI, Cards, Wallets, NetBanking) to complete your
                  purchase securely.
                </p>
              </Card.Body>
            </Card>

            <h6 className="checkout-form mb-3">Billing address</h6>
            <Form.Check
              type="radio"
              name="billing"
              label="Same as shipping address"
              defaultChecked
            />
            <Form.Check
              type="radio"
              name="billing"
              label="Use a different billing address"
            />

            <div className="mt-4">
              <Button
                style={{
                  backgroundColor: "#7B4B3A",
                  border: "none",
                  borderRadius: "6px",
                  padding: "12px 40px",
                }}
                onClick={handlePlaceOrder}
              >
                PLACE ORDER
              </Button>
            </div>
          </Col>

          {/* RIGHT SIDE - SUMMARY */}
          <Col md={5}>
            <Card className="mb-3">
              <Card.Body>
                <h6 className="fw-semibold small mb-2">Available Offers</h6>
                <p className="small mb-0">
                  10% Instant Discount on RBL Bank Credit Card and Credit Card
                  EMI on a min spend of ₹3,500.
                </p>
              </Card.Body>
            </Card>

            <h6 className="fw-semibold mb-3">
              {box.size}-PIECE BOX ({selectedChocolates.length} Chocolates)
            </h6>

            {selectedChocolates.map((item) => (
              <Card className="mb-2 rounded-0" key={item.id}>
                <Card.Body className="d-flex align-items-center">
                  <img
                    src={item.img || "./images/product-grid.png"}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    className="me-3"
                  />
                  <div className="flex-grow-1">
                    <p className="mb-1 small fw-semibold">{item.name}</p>
                    <p className="mb-1 small text-muted">
                      Qty: {item.qty} × ₹{item.price || box.price}
                    </p>
                    <p className="small fw-semibold">
                      ₹{((item.price || box.price) * (item.qty || 1)).toFixed(2)}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex my-3">
              <Form.Control
                type="text"
                placeholder="Gift Voucher Code"
                className="rounded-0 me-2"
              />
              <Button
                style={{ backgroundColor: "#7B4B3A", border: "none" }}
                className="rounded-0"
              >
                Apply
              </Button>
            </div>

            <h6 className="fw-semibold mb-3">PRICE DETAILS</h6>
            <div className="d-flex justify-content-between small mb-1">
              <span>Box Price</span>
              <span>₹{box.price?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span>Products Total</span>
              <span>
                ₹
                {selectedChocolates
                  .reduce(
                    (sum, item) =>
                      sum + (item.price || box.price || 0) * (item.qty || 1),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span>Shipping Fee</span>
              <span className="text-success">FREE</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-semibold">
              <span>Total Amount</span>
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
