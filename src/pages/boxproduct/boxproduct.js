import React, { useState, useEffect } from "react";
import {
  Container, Row, Col, Button, ProgressBar,
  Breadcrumb, Spinner, Dropdown, DropdownButton
} from "react-bootstrap";
import { NavLink, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Boxproduct = () => {
  const { boxId } = useParams();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [box, setBox] = useState({});
  const [boxLimit, setBoxLimit] = useState(16);
  const [typeLimits, setTypeLimits] = useState({});
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolveImage = (img) => {
    if (!img) return "/images/product-grid.png";
    if (/^(https?:)?\/\//i.test(img) || /^data:/i.test(img)) return img;
    const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
    return img.startsWith("/") ? `${base}${img}` : `${base}/${img}`;
  };

  useEffect(() => {
    const fetchBoxAndProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
        const url = `${base}/api/boxes/${boxId}`; // returns box + all products
        const res = await axios.get(url);
        const { box: fetchedBox, products: fetchedProducts } = res.data;

        setBox(fetchedBox);
        setProducts(fetchedProducts);
        setBoxLimit(fetchedBox.totalLimit || fetchedBox.size || 16);
        setTypeLimits(fetchedBox.typeLimits || {});
      } catch (err) {
        console.error(err);
        setError("Failed to load box or products.");
      } finally {
        setLoading(false);
      }
    };

    if (boxId) fetchBoxAndProducts();
  }, [boxId]);

  const chocolateTypes = ["all", ...new Set(products.map(p => (p.type || "").toLowerCase()).filter(Boolean))];

  const updateQuantity = (id, change) => {
    setCart(prev => {
      const product = products.find(p => p._id === id);
      if (!product) return prev;

      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + change);
      const delta = newQty - currentQty;
      const total = Object.values(prev).reduce((a, b) => a + b, 0) + delta;

      if (delta > 0 && total > boxLimit) {
        alert(`You can only select up to ${boxLimit} chocolates.`);
        return prev;
      }

      const type = (product.type || "").toLowerCase();
      if (delta > 0 && typeLimits[type] !== undefined) {
        const typeCount = products.reduce((acc, p) => {
          const qty = prev[p._id] || 0;
          acc[(p.type || "").toLowerCase()] = (acc[(p.type || "").toLowerCase()] || 0) + qty;
          return acc;
        }, {})[type] || 0;
        if (typeCount + delta > typeLimits[type]) {
          alert(`You can only select up to ${typeLimits[type]} ${type} chocolates.`);
          return prev;
        }
      }

      const updated = { ...prev, [id]: newQty };
      if (updated[id] === 0) delete updated[id];
      return updated;
    });
  };

  return (
    <div>
      <Header />
      <Container fluid className="py-4 container">
        <Breadcrumb>
          <Breadcrumb.Item href="/ownbox">BUILD YOUR OWN BOX</Breadcrumb.Item>
          <Breadcrumb.Item active>{box?.size ? `BOX OF ${box.size}` : "BOX"}</Breadcrumb.Item>
        </Breadcrumb>

        <h5 className="text-center mb-4 boxproduct-title" style={{ color: "#8B6F4E" }}>CHOOSE YOUR CHOCOLATES</h5>

        <div className="d-flex justify-content-end mb-3">
          <DropdownButton title={selectedType === "all" ? "All Types" : selectedType.toUpperCase()} variant="outline-dark" size="sm">
            {chocolateTypes.map(type => (
              <Dropdown.Item key={type} onClick={() => setSelectedType(type)} active={selectedType === type}>
                {type === "all" ? "All Types" : type.toUpperCase()}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        {loading ? (
          <div className="text-center my-5"><Spinner animation="border" variant="warning" /><p>Loading...</p></div>
        ) : error ? (
          <div className="text-center my-5 text-danger">{error}</div>
        ) : (
          <Row>
            {products.filter(p => selectedType === "all" || (p.type || "").toLowerCase() === selectedType).map(product => (
              <Col key={product._id} xs={6} sm={4} md={3} lg={2} className="mb-4 text-center">
                <p className="small fw-semibold boxproduct-name">{product.name}</p>
                {product.type && <p className="text-muted small">{product.type} Chocolate</p>}
                <div className="d-flex justify-content-center align-items-center">
                  <Button variant="light" className="border rounded-0" onClick={() => updateQuantity(product._id, -1)}>-</Button>
                  <span className="px-3 py-1 border-top border-bottom" style={{ minWidth: 30, textAlign: "center" }}>{cart[product._id] || 0}</span>
                  <Button variant="light" className="border rounded-0" onClick={() => updateQuantity(product._id, 1)}>+</Button>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
          <div className="position-fixed bottom-0 start-0 w-100 bg-dark shadow-lg p-3 d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 me-3 text-light">
              <p className="mb-1 small">Select up to {boxLimit} total | <strong>{Object.values(cart).reduce((a, b) => a + b, 0)} selected</strong></p>
              <ProgressBar now={(Object.values(cart).reduce((a, b) => a + b, 0) / boxLimit) * 100} variant="warning" style={{ height: 6 }} />
            </div>
            <NavLink to="/boxcheckout" state={{ cart, products, box }} style={{ textDecoration: "none" }}>
              <Button variant="dark" style={{ backgroundColor: "#fff", border: "none", color: "#6F524C" }}>Review Your Order</Button>
            </NavLink>
          </div>
        )}
      </Container>
      <Footer logoSrc="/images/logo-footer.png" />
    </div>
  );
};

export default Boxproduct;
