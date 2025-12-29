import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Boxcheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [box, setBox] = useState(
    state.box || JSON.parse(localStorage.getItem("box") || "{}")
  );
  const [cart] = useState(
    state.cart || JSON.parse(localStorage.getItem("cart") || "{}")
  );
  const [products] = useState(
    state.products || JSON.parse(localStorage.getItem("products") || "[]")
  );
  const [selectedChocolates, setSelectedChocolates] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);

  // ✅ Image helper (FIXED)
  const getImageUrl = (image) => {
    if (!image) return `${API_BASE_URL}/images/product-grid.png`;

    const img = Array.isArray(image) ? image[0] : image.split(",")[0];

    return img.startsWith("http")
      ? img
      : `${API_BASE_URL}/${img.replace(/^\/+/, "")}`;
  };

  // ✅ Build selected chocolates with real images
  useEffect(() => {
    if (products.length && Object.keys(cart).length) {
      const selected = products
        .filter((p) => cart[p._id] > 0)
        .map((p) => ({
          id: p._id,
          name: p.name || p.chocolateName,
          img: getImageUrl(p.image || p.images),
          qty: cart[p._id],
        }));

      setSelectedChocolates(selected);
    }
  }, [cart, products]);

  // ✅ Save box to localStorage
  useEffect(() => {
    if (box && box._id) {
      localStorage.setItem("box", JSON.stringify(box));
    }
  }, [box]);

  // ✅ Use box price
  useEffect(() => {
    const total = box?.price || box?.boxPrice || box?.totalPrice || 0;
    setOrderTotal(total);
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
      categoryId: box?.category?._id || products[0]?.category?._id,
      boxId: box._id,
      price: orderTotal,
      selectedChocolates: selectedChocolates.map((i) => ({
        chocolateId: i.id,
        quantity: i.qty,
      })),
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/cart/custom-box`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Box added to cart successfully!");

      const existingBoxes = JSON.parse(localStorage.getItem("boxes") || "[]");
      const newBox = {
        _id: box._id,
        size: box.size,
        price: orderTotal,
        selectedChocolates,
      };

      const updatedBoxes = [
        ...existingBoxes.filter((b) => b.size !== box.size),
        newBox,
      ];

      localStorage.setItem("boxes", JSON.stringify(updatedBoxes));

      navigate("/cart");
    } catch (err) {
      console.error("Checkout error:", err.response || err);
      alert(err.response?.data?.message || "Checkout failed.");
    }
  };

  if (!box?._id || !selectedChocolates.length) {
    return (
      <Container className="py-5 text-center">
        <p>Box data or selected chocolates not found.</p>
      </Container>
    );
  }

  return (
    <div>
      <Header />
      <Container className="py-4 my-5">
        <h5 className="fw-semibold mb-3 montserrat-font" style={{ color: "#312526" }}>
          Review Your Box – Chocolates
        </h5>

        <p className="fw-semibold small figtree-font">{box.size}-PIECE BOX</p>

        {selectedChocolates.map((item) => (
          <Row key={item.id} className="align-items-center mb-3 figtree-font">
            <Col xs={3} sm={2}>
              <img
                src={item.img}
                alt={item.name}
                className="img-fluid border w-50"
                style={{ borderRadius: "4px" }}
                onError={(e) => {
                  e.target.src = `${API_BASE_URL}/images/product-grid.png`;
                }}
              />
            </Col>
            <Col xs={9} sm={10}>
              <p className="mb-0 fw-semibold small">{item.name}</p>
              <p className="text-muted small mb-1">Qty: {item.qty}</p>
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
          <Button className="montserrat-font"
            style={{
              backgroundColor: "#312526",
              border: "none",
              borderRadius: "6px",
              padding: "10px 30px",
            }}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Boxcheckout;
