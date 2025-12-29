import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        const cookieCart = Cookies.get("guestCart");
        setCart(cookieCart ? JSON.parse(cookieCart) : { items: [] });
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data || { items: [] });
      } catch (err) {
        console.error(err);
        setCart({ items: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /* ================= HELPERS ================= */
  const getImageUrl = (item) => {
    const target = item.product || item;
    const imageField = target.image || target.images || "";
    if (!imageField) return `${API_BASE_URL}/images/product-grid.png`;

    const first = Array.isArray(imageField)
      ? imageField[0]
      : imageField.split(",")[0];

    return first.startsWith("http")
      ? first
      : `${API_BASE_URL}${first.startsWith("/") ? "" : "/"}${first}`;
  };

  const calculateTotal = () =>
    cart.items.reduce((acc, i) => {
      const price = Number(i.price || i.product?.price || 0);
      const qty = Number(i.quantity || 1);
      return acc + price * qty;
    }, 0);

  const updateQuantity = (index, delta) => {
    const newCart = { ...cart };
    const newQty = (newCart.items[index].quantity || 1) + delta;
    if (newQty < 1) return;

    newCart.items[index].quantity = newQty;
    setCart(newCart);

    const token = localStorage.getItem("token");
    if (!token) {
      Cookies.set("guestCart", JSON.stringify(newCart), { expires: 7 });
    }
  };

  const removeItem = (index) => {
    const newCart = { ...cart };
    newCart.items.splice(index, 1);
    setCart(newCart);

    const token = localStorage.getItem("token");
    if (!token) {
      Cookies.set("guestCart", JSON.stringify(newCart), { expires: 7 });
    }
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { state: { redirectTo: "/checkout" } });
    else navigate("/checkout", { state: { cart } });
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  /* ================= EMPTY CART ================= */
  if (!cart.items.length) {
    return (
      <div>
        <Header />
        <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
          <p className="fs-5 text-muted">Your cart is empty.</p>
          <NavLink to="/" className="btn btn-outline-dark mt-3">
            Go Shopping
          </NavLink>
        </Container>
        <Footer />
      </div>
    );
  }

  /* ================= MAIN CART ================= */
  return (
    <div>
      <Header />

      <Container className="py-4" style={{ minHeight: "70vh" }}>
        <h5 className="fw-semibold mb-4" style={{ color: "#7B4B3A" }}>
          Your Cart {!localStorage.getItem("token") && "(Guest Mode)"}
        </h5>

        {cart.items.map((item, index) => (
          <Row
            key={index}
            className="align-items-center mb-3 border-bottom pb-3"
          >
            <Col xs={3} sm={2}>
              <img
                src={getImageUrl(item)}
                alt="product"
                className="img-fluid rounded border"
                onError={(e) =>
                  (e.target.src = `${API_BASE_URL}/images/product-grid.png`)
                }
              />
            </Col>

            <Col xs={9} sm={10}>
              <div className="d-flex justify-content-between">
                <div>
                  <p className="fw-bold mb-1">
                    {item.product?.name || item.name}
                  </p>

                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => updateQuantity(index, -1)}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => updateQuantity(index, 1)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="fw-bold">
                  ₹
                  {(
                    Number(item.price || item.product?.price || 0) *
                    item.quantity
                  ).toFixed(2)}
                </div>
              </div>
            </Col>
          </Row>
        ))}

        <Row className="mt-4">
          <Col md={{ span: 4, offset: 8 }}>
            <div className="d-flex justify-content-between border-top pt-3 mb-3">
              <span className="fw-semibold">Subtotal</span>
              <span className="fw-bold fs-5">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>

            <Button
              className="w-100 py-2 fw-bold"
              style={{ backgroundColor: "#7B4B3A", border: "none" }}
              onClick={handleCheckout}
            >
              {localStorage.getItem("token")
                ? "PROCEED TO CHECKOUT"
                : "LOGIN TO CHECKOUT"}
            </Button>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Cart;
