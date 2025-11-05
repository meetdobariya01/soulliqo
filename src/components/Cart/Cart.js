// // src/pages/cart/Cart.jsx
// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Button, Spinner, Card } from "react-bootstrap";
// import { NavLink, useNavigate } from "react-router-dom";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import axios from "axios";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const Cart = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch cart data from backend
//   useEffect(() => {
//     const fetchCart = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please log in to view your cart.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const res = await axios.get(`${API_BASE_URL}/cart`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCart(res.data || { items: [] });
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         alert("Failed to load cart.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, [navigate]);

//   if (loading)
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
//         <Spinner animation="border" variant="secondary" />
//       </div>
//     );

//   if (!cart || (!cart.items?.length && !cart.customBoxes?.length))
//     return (
//       <Container className="py-5 text-center">
//         <p>Your cart is empty.</p>
//         <NavLink to="/" className="btn btn-outline-secondary">Go Shopping</NavLink>
//       </Container>
//     );

//   // ✅ Compute total
//   const orderTotal =
//     (cart.items || []).reduce(
//       (acc, i) => acc + (i.product?.price || i.price || 0) * (i.quantity || 1),
//       0
//     ) +
//     (cart.customBoxes || []).reduce((acc, b) => acc + (b.price || b.totalPrice || 0), 0);

//   // ✅ Save cart before checkout
//   const handleCheckout = () => {
//     localStorage.setItem("checkoutCart", JSON.stringify(cart));
//     navigate("/checkout");
//   };

//   return (
//     <div>
//       <Header />
//       <Container className="py-4">
//         <h5 className="fw-semibold mb-3" style={{ color: "#8B6F4E" }}>
//           Your Cart
//         </h5>

//         {/* Regular Products */}
//         {(cart.items || []).map((item) => (
//           <Row key={item._id} className="align-items-center mb-3">
//             <Col xs={3} sm={2}>
//               <img
//                 src={item.product?.image || "/images/product-grid.png"}
//                 alt={item.product?.name}
//                 className="img-fluid border"
//                 style={{ borderRadius: "6px" }}
//               />
//             </Col>
//             <Col xs={9} sm={10}>
//               <p className="fw-semibold small mb-0">{item.product?.name}</p>
//               <p className="text-muted small mb-0">Qty: {item.quantity}</p>
//               <p className="fw-semibold small mb-0">
//                 ₹{(item.product?.price * item.quantity).toFixed(2)}
//               </p>
//             </Col>
//           </Row>
//         ))}

//         {/* Custom Boxes */}
//         {(cart.customBoxes || []).map((box) => (
//           <Card key={box._id} className="mb-3">
//             <Card.Body>
//               <h6 className="fw-bold mb-2">{box.size}-Piece Custom Box</h6>
//               <ul className="small mb-2 ps-3">
//                 {box.selectedChocolates?.map((c, idx) => (
//                   <li key={idx}>
//                     {c.name} × {c.quantity}
//                   </li>
//                 ))}
//               </ul>
//               <p className="fw-semibold">₹{(box.price || box.totalPrice).toFixed(2)}</p>
//             </Card.Body>
//           </Card>
//         ))}

//         <hr />

//         <Row>
//           <Col xs={6}>
//             <p className="fw-semibold small mb-0">ORDER TOTAL</p>
//           </Col>
//           <Col xs={6} className="text-end">
//             <h6 className="fw-bold mb-0">₹{orderTotal.toFixed(2)}</h6>
//           </Col>
//         </Row>

//         <div className="text-end mt-4">
//           <Button
//             onClick={handleCheckout}
//             style={{
//               backgroundColor: "#7B4B3A",
//               border: "none",
//               borderRadius: "6px",
//               padding: "10px 30px",
//             }}
//           >
//             Checkout
//           </Button>
//         </div>
//       </Container>
//       <Footer />
//     </div>
//   );
// };

// export default Cart;


// src/pages/cart/Cart.jsx
// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Button, Spinner, Card } from "react-bootstrap";
// import { NavLink, useNavigate } from "react-router-dom";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";
// import axios from "axios";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const Cart = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch cart data from backend
//   useEffect(() => {
//     const fetchCart = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("Please log in to view your cart.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const res = await axios.get(`${API_BASE_URL}/cart`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCart(res.data || { items: [] });
//       } catch (err) {
//         console.error("Cart fetch error:", err);
//         alert("Failed to load cart.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, [navigate]);

//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ height: "80vh" }}
//       >
//         <Spinner animation="border" variant="secondary" />
//       </div>
//     );

//   if (!cart || !cart.items?.length)
//     return (
//       <Container className="py-5 text-center">
//         <p>Your cart is empty.</p>
//         <NavLink to="/" className="btn btn-outline-secondary">
//           Go Shopping
//         </NavLink>
//       </Container>
//     );

//   // ✅ Compute order total
//   const orderTotal = (cart.items || []).reduce((acc, i) => {
//     const itemPrice = Number(i.price) || Number(i.product?.price) || 0;
//     const qty = Number(i.quantity) || 1;
//     return acc + itemPrice * qty;
//   }, 0);

//   // ✅ Proceed to checkout
//   const handleCheckout = () => {
//     localStorage.setItem("checkoutCart", JSON.stringify(cart));
//     navigate("/checkout");
//   };

//   return (
//     <div>
//       <Header />
//       <Container className="py-4">
//         <h5 className="fw-semibold mb-3" style={{ color: "#8B6F4E" }}>
//           Your Cart
//         </h5>

//         {(cart.items || []).map((item, index) => (
//           <Row key={index} className="align-items-center mb-3">
//             <Col xs={3} sm={2}>
//               <img
//                 src={
//                   item.product?.image ||
//                   item.box?.image ||
//                   "/images/product-grid.png"
//                 }
//                 alt={item.product?.name || item.box?.name || "Custom Box"}
//                 className="img-fluid border"
//                 style={{ borderRadius: "6px" }}
//               />
//             </Col>

//             <Col xs={9} sm={10}>
//               <p className="fw-semibold small mb-0">
//                 {item.product?.name || item.name || "Custom Box"}
//               </p>
//               <p className="text-muted small mb-0">Qty: {item.quantity || 1}</p>

//               {/* If it's a box, show its chocolates */}
//               {item.type === "box" && (
//                 <ul className="small mb-1 ps-3">
//                   {item.products?.map((p, idx) => (
//                     <li key={idx}>
//                       {p.chocolate?.name} × {p.quantity}
//                     </li>
//                   ))}
//                 </ul>
//               )}

//               <p className="fw-semibold small mb-0">
//                 ₹{Number(item.price || item.product?.price || 0).toFixed(2)}
//               </p>
//             </Col>
//           </Row>
//         ))}

//         <hr />

//         <Row>
//           <Col xs={6}>
//             <p className="fw-semibold small mb-0">ORDER TOTAL</p>
//           </Col>
//           <Col xs={6} className="text-end">
//             <h6 className="fw-bold mb-0">₹{orderTotal.toFixed(2)}</h6>
//           </Col>
//         </Row>

//         <div className="text-end mt-4">
//           <Button
//             onClick={handleCheckout}
//             style={{
//               backgroundColor: "#7B4B3A",
//               border: "none",
//               borderRadius: "6px",
//               padding: "10px 30px",
//             }}
//           >
//             Checkout
//           </Button>
//         </div>
//       </Container>
//       <Footer />
//     </div>
//   );
// };

// export default Cart;


import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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

  const orderTotal = (cart.items || []).reduce((acc, i) => {
    const itemPrice = Number(i.price) || Number(i.product?.price) || 0;
    const qty = Number(i.quantity) || 1;
    return acc + itemPrice * qty;
  }, 0);

  // ✅ Pass the full cart to checkout
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
                src={
                  item.product?.image ||
                  item.box?.image ||
                  "/images/product-grid.png"
                }
                alt={item.product?.name || item.name || "Custom Box"}
                className="img-fluid border"
                style={{ borderRadius: "6px" }}
              />
            </Col>

            <Col xs={9} sm={10}>
              <p className="fw-semibold small mb-0">
                {item.product?.name || item.name || "Custom Box"}
              </p>
              <p className="text-muted small mb-0">Qty: {item.quantity || 1}</p>

              {/* If it's a box, show its chocolates */}
              {item.type === "box" && (
                <ul className="small mb-1 ps-3">
                  {item.products?.map((p, idx) => (
                    <li key={idx}>
                      {p.chocolate?.name} × {p.quantity}
                    </li>
                  ))}
                </ul>
              )}

              <p className="fw-semibold small mb-0">
                ₹{Number(item.price || item.product?.price || 0).toFixed(2)}
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
