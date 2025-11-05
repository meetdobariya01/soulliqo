import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


const Boxcheckout = () => {
const location = useLocation();
const navigate = useNavigate();
const state = location.state || {};

// ✅ Only use state.box first; fallback to localStorage if needed
const [box, setBox] = useState(state.box || JSON.parse(localStorage.getItem("box") || "{}"));
const [cart] = useState(state.cart || JSON.parse(localStorage.getItem("cart") || "{}"));
const [products] = useState(state.products || JSON.parse(localStorage.getItem("products") || "[]"));
const [selectedChocolates, setSelectedChocolates] = useState([]);
const [orderTotal, setOrderTotal] = useState(0);

// Build selected chocolates
useEffect(() => {
if (products.length && Object.keys(cart).length) {
const selected = products
.filter((p) => cart[p._id] > 0)
.map((p) => ({
id: p._id,
name: p.name || p.chocolateName,
img: p.image,
qty: cart[p._id],
}));
setSelectedChocolates(selected);
}
}, [cart, products]);

// ✅ Save only current box to localStorage
useEffect(() => {
if (box && box._id) {
localStorage.setItem("box", JSON.stringify(box));
}
}, [box]);

// ✅ Use box price (not chocolates)
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
    const res = await axios.post(`${API_BASE_URL}/cart/custom-box`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert(res.data.message || "Box added to cart successfully!");

    // ✅ Save to localStorage (for reload persistence)
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

    // ✅ Redirect to Cart page instead of Checkout
    navigate("/cart");
  } catch (err) {
    console.error("Checkout error:", err.response || err);
    alert(err.response?.data?.message || "Checkout failed.");
  }
};

// ✅ Prevent showing old data
if (!box?._id || !selectedChocolates.length) {
  return (
    <Container className="py-5 text-center">
      <p>Box data or selected chocolates not found. Please select chocolates first.</p>
    </Container>
  );
}

return ( <div> <Header /> <Container className="py-4">
<h5 className="fw-semibold mb-3" style={{ color: "#8B6F4E" }}>
Review Your Box – Chocolates </h5> <p className="fw-semibold small">{box.size}-PIECE BOX</p>


    {selectedChocolates.map((item) => (
      <Row key={item.id} className="align-items-center mb-3">
        <Col xs={3} sm={2}>
          <img
            src={item.img || "./images/product-grid.png"}
            alt={item.name}
            className="img-fluid border w-50"
            style={{ borderRadius: "4px" }}
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
      <Button
        style={{
          backgroundColor: "#7B4B3A",
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