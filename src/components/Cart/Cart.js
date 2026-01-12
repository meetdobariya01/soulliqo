// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
// import { NavLink, useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import axios from "axios";
// import Header from "../../components/header/header";
// import Footer from "../../components/footer/footer";

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

// const Cart = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH CART =================
//   useEffect(() => {
//     const fetchCart = async () => {
//       const token = localStorage.getItem("token");

//       // Guest cart
//       if (!token) {
//         const cookieCart = Cookies.get("guestCart");
//         setCart(cookieCart ? JSON.parse(cookieCart) : { items: [] });
//         setLoading(false);
//         return;
//       }

//       // Logged-in cart
//       try {
//         const res = await axios.get(`${API_BASE_URL}/cart`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCart(res.data || { items: [] });
//       } catch (err) {
//         console.error(err);
//         setCart({ items: [] });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//   }, []);

//   // ================= NAME RESOLVER =================
// const getItemName = (item) => {
//   if (item.product?.name) return item.product.name; // normal product
//   if (item.box?.boxName) return item.box.boxName;           // root-level boxName
//   return "Custom Box";                             // fallback
// };

//   // ================= IMAGE RESOLVER =================
//   const getImageUrl = (item) => {
//     // Product image
//     if (item.product) {
//       const img = item.product.image || item.product.images;
//       if (!img) return "/images/product-grid.png";

//       const first = Array.isArray(img)
//         ? img
//             .flatMap((i) =>
//               typeof i === "string" ? i.split(",") : i
//             )[0]
//         : img.split(",")[0];

//       return first.startsWith("http")
//         ? first
//         : `${first.startsWith("/") ? "" : "/"}${first}`;
//     }

//     // Custom box image
//     if (item.box?.image) return item.box.image;
//     if (item.boxImage) return item.boxImage;
//     if (item.image) return item.image;

//     return "/images/product-grid.png";
//   };

//   // ================= TOTAL =================
//   const calculateTotal = () =>
//     cart?.items?.reduce((acc, i) => {
//       const price = Number(i.price || i.product?.price || 0);
//       const qty = Number(i.quantity || 1);
//       return acc + price * qty;
//     }, 0) || 0;

//   // ================= UPDATE QTY =================
//   const updateQuantity = async (index, delta) => {
//     const newCart = { ...cart };
//     const newQty = (newCart.items[index].quantity || 1) + delta;
//     if (newQty < 1) return;

//     newCart.items[index].quantity = newQty;
//     setCart(newCart);

//     const token = localStorage.getItem("token");

//     if (!token) {
//       Cookies.set("guestCart", JSON.stringify(newCart), { expires: 7 });
//     } else {
//       try {
//         const item = newCart.items[index];
//         await axios.put(
//           `${API_BASE_URL}/cart/update`,
//           {
//             productId: item.product?._id,
//             quantity: newQty,
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   // ================= REMOVE ITEM =================
//   const removeItem = async (index) => {
//     const newCart = { ...cart };
//     const removedItem = newCart.items.splice(index, 1)[0];
//     setCart(newCart);

//     const token = localStorage.getItem("token");

//     if (!token) {
//       Cookies.set("guestCart", JSON.stringify(newCart), { expires: 7 });
//     } else if (removedItem?._id) {
//       try {
//         await axios.delete(
//           `${API_BASE_URL}/cart/remove/${removedItem._id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   // ================= CHECKOUT =================
//   const handleCheckout = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login", { state: { redirectTo: "/checkout" } });
//     } else {
//       navigate("/checkout", { state: { cart } });
//     }
//   };

//   // ================= UI =================
//   if (loading)
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ height: "80vh" }}
//       >
//         <Spinner animation="border" variant="secondary" />
//       </div>
//     );

//   if (!cart?.items?.length)
//     return (
//       <div>
//         <Header />
//         <Container className="py-5 text-center" style={{ minHeight: "50vh" }}>
//           <p className="fs-5 text-muted mt-5">Your cart is empty.</p>
//           <NavLink
//             to="/"
//             className="btn btn-outline-dark px-4 py-2 mt-2"
//           >
//             Go Shopping
//           </NavLink>
//         </Container>
//         <Footer />
//       </div>
//     );

//   return (
//     <div>
//       <Header />
//       <Container className="py-4" style={{ minHeight: "70vh" }}>
//         <h5
//           className="fw-semibold my-4 montserrat-font fs-2"
//           style={{ color: "#312526" }}
//         >
//           Your Cart {!localStorage.getItem("token") && "(Guest Mode)"}
//         </h5>

//         {cart.items.map((item, index) => (
//           <Row
//             key={index}
//             className="align-items-center mb-4 border-bottom pb-3"
//           >
//             <Col xs={4} sm={2}>
//               <img
//                 src={getImageUrl(item)}
//                 alt={getItemName(item)}
//                 className="img-fluid rounded border"
//                 onError={(e) =>
//                   (e.target.src = "/images/product-grid.png")
//                 }
//               />
//             </Col>

//             <Col xs={8} sm={10}>
//               <div className="d-flex justify-content-between align-items-start">
//                 <div>
//                   <p className="fw-bold mb-1 montserrat-font">
//                     {getItemName(item)}
//                   </p>

//                   <div
//                     className="d-flex align-items-center gap-2 mb-2 figtree-font border rounded px-2 py-1"
//                     style={{ width: "fit-content" }}
//                   >
//                     <Button
//                       size="sm"
//                       variant=""
//                       onClick={() => updateQuantity(index, -1)}
//                     >
//                       -
//                     </Button>
//                     <span>{item.quantity}</span>
//                     <Button
//                       size="sm"
//                       variant=""
//                       onClick={() => updateQuantity(index, 1)}
//                     >
//                       +
//                     </Button>
//                   </div>

//                   <Button
//                     size="sm"
//                     variant=""
//                     onClick={() => removeItem(index)}
//                   >
//                     Remove
//                   </Button>
//                 </div>

//                 <div className="text-end">
//                   <p className="fw-bold figtree-font">
//                     ₹
//                     {(
//                       Number(item.price || item.product?.price || 0) *
//                       item.quantity
//                     ).toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         ))}

//         <Row className="mt-4">
//           <Col md={{ span: 4, offset: 8 }} className="text-end">
//             <div className="d-flex justify-content-between mb-3 border-top pt-3">
//               <span className="fw-semibold montserrat-font fs-4">
//                 Subtotal
//               </span>
//               <span className="fw-bold fs-5 figtree-font">
//                 ₹{calculateTotal().toFixed(2)}
//               </span>
//             </div>

//             <Button
//               onClick={handleCheckout}
//               className="w-100 py-2 fw-bold"
//               style={{
//                 backgroundColor: "#312526",
//                 border: "none",
//                 letterSpacing: "1px",
//               }}
//             >
//               {localStorage.getItem("token")
//                 ? "PROCEED TO CHECKOUT"
//                 : "LOGIN TO CHECKOUT"}
//             </Button>

//             {!localStorage.getItem("token") && (
//               <p className="small text-muted mt-2 text-center">
//                 Log in to sync your guest cart and finalize your order.
//               </p>
//             )}
//           </Col>
//         </Row>
//       </Container>
//       <Footer />
//     </div>
//   );
// };

// export default Cart;
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CART & BOXES =================
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        const cookieCart = Cookies.get("guestCart");
        setCart(cookieCart ? JSON.parse(cookieCart) : { items: [] });

        const guestBoxes = JSON.parse(localStorage.getItem("boxes") || "[]");
        setBoxes(guestBoxes);

        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data || { items: [] });

        const serverBoxes = JSON.parse(localStorage.getItem("boxes") || "[]");
        setBoxes(serverBoxes);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCart({ items: [] });
        setBoxes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ================= NAME RESOLVER =================
  const getItemName = (item) => {
    if (item.product?.name) return item.product.name; // normal product
    if (item.box?.boxName) return item.box.boxName;   // root-level boxName
    return "Custom Box";                              // fallback
  };

  const getBoxName = (box) => box.boxName || `${box.size}-PIECE BOX`;

  // ================= IMAGE RESOLVER =================
  const getImageUrl = (item) => {
    if (item.product) {
      const img = item.product.image || item.product.images;
      if (!img) return "/images/product-grid.png";

      const first = Array.isArray(img)
        ? img.flatMap((i) => (typeof i === "string" ? i.split(",") : i))[0]
        : img.split(",")[0];

      return first.startsWith("http") ? first : `${first.startsWith("/") ? "" : "/"}${first}`;
    }

    if (item.box?.image) return item.box.image;
    if (item.boxImage) return item.boxImage;
    if (item.image) return item.image;

    return "/images/product-grid.png";
  };

  // ================= SUBTOTAL =================
  const calculateTotal = () => {
    const itemsTotal = cart.items?.reduce((sum, i) => {
      const price = Number(i.price || i.product?.price || 0);
      const qty = Number(i.quantity || 1);
      return sum + price * qty;
    }, 0) || 0;

    const boxesTotal = boxes.reduce((sum, b) => sum + Number(b.price || 0), 0);
    return itemsTotal + boxesTotal;
  };

  // ================= UPDATE QTY =================
  const updateQuantity = async (index, delta) => {
    const newCart = { ...cart };
    const newQty = (newCart.items[index].quantity || 1) + delta;
    if (newQty < 1) return;
    newCart.items[index].quantity = newQty;
    setCart(newCart);

    const token = localStorage.getItem("token");
    if (!token) {
      Cookies.set("guestCart", JSON.stringify(newCart), { expires: 7 });
    } else {
      const item = newCart.items[index];
      try {
        await axios.put(`${API_BASE_URL}/cart/update`, {
          productId: item.product?._id,
          quantity: newQty,
        }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (index) => {
    const newCart = { ...cart };
    const removedItem = newCart.items.splice(index, 1)[0];
    setCart(newCart);

    const token = localStorage.getItem("token");
    if (!token) {
      Cookies.set("guestCart", JSON.stringify(newCart), { expires: 7 });
    } else if (removedItem._id) {
      try {
        await axios.delete(`${API_BASE_URL}/cart/remove/${removedItem._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Error removing item:", err);
      }
    }
  };

  // ================= REMOVE BOX =================
  const removeBox = (index) => {
    const newBoxes = [...boxes];
    newBoxes.splice(index, 1);
    setBoxes(newBoxes);
    localStorage.setItem("boxes", JSON.stringify(newBoxes));
  };

  // ================= CHECKOUT =================
  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    navigate("/checkout", { state: { cart, boxes, guest: !token } });
  };

  // ================= UI =================
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Spinner animation="border" variant="secondary" />
    </div>
  );

  if ((!cart?.items?.length) && !boxes.length) return (
    <>
      <Header />
      <Container className="py-5 text-center" style={{ minHeight: "50vh" }}>
        <p className="fs-5 text-muted mt-5">Your cart is empty.</p>
        <NavLink to="/" className="btn btn-outline-dark px-4 py-2 mt-2">Go Shopping</NavLink>
      </Container>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <Container className="py-4" style={{ minHeight: "70vh" }}>
        <h5 className="fw-semibold my-4 montserrat-font fs-2" style={{ color: "#312526" }}>
          Your Cart {localStorage.getItem("token") ? "" : "(Guest Mode)"}
        </h5>

        {/* Cart Items */}
        {cart.items.map((item, index) => (
          <Row key={index} className="align-items-center mb-4 border-bottom pb-3">
            <Col xs={4} sm={2}>
              <img
                src={getImageUrl(item)}
                alt={getItemName(item)}
                className="img-fluid rounded border"
                onError={e => e.target.src = `${API_BASE_URL}/images/product-grid.png`}
              />
            </Col>
            <Col xs={8} sm={10}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="fw-bold mb-1 montserrat-font">{getItemName(item)}</p>
                  <div className="d-flex align-items-center gap-2 mb-2 figtree-font border rounded px-2 py-1" style={{ width: "fit-content" }}>
                    <Button size="sm" variant="" onClick={() => updateQuantity(index, -1)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button size="sm" variant="" onClick={() => updateQuantity(index, 1)}>+</Button>
                  </div>
                  <Button size="sm" variant="" onClick={() => removeItem(index)}>Remove</Button>
                </div>
                <div className="text-end">
                  <p className="fw-bold figtree-font">₹{(Number(item.price || item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </Col>
          </Row>
        ))}

        {/* Boxes */}
        {boxes.length > 0 && (
          <div className="mt-4">
            <h5 className="fw-semibold montserrat-font fs-4 mb-3">Your Boxes</h5>
            {boxes.map((box, index) => (
              <Row key={index} className="align-items-center mb-4 border-bottom pb-3">
                <Col xs={4} sm={2}>
                  <img
                    src={box.selectedChocolates[0]?.img || `${API_BASE_URL}/images/product-grid.png`}
                    alt={getBoxName(box)}
                    className="img-fluid rounded border"
                  />
                </Col>
                <Col xs={8} sm={10}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="fw-bold mb-1 montserrat-font">{getBoxName(box)}</p>
                      <p className="small text-muted">{box.selectedChocolates.map(c => `${c.name} x${c.qty}`).join(", ")}</p>
                      <Button size="sm" variant="" onClick={() => removeBox(index)}>Remove Box</Button>
                    </div>
                    <div className="text-end">
                      <p className="fw-bold figtree-font">₹{Number(box.price).toFixed(2)}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        )}

        {/* Subtotal & Checkout */}
        <Row className="mt-4">
          <Col md={{ span: 4, offset: 8 }} className="text-end">
            <div className="d-flex justify-content-between mb-3 border-top pt-3">
              <span className="fw-semibold montserrat-font fs-4">Subtotal</span>
              <span className="fw-bold fs-5 figtree-font">₹{calculateTotal().toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} className="w-100 py-2 fw-bold" style={{ backgroundColor: "#312526", border: "none", letterSpacing: "1px" }}>
              {localStorage.getItem("token") ? "PROCEED TO CHECKOUT" : "CHECKOUT AS GUEST"}
            </Button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
