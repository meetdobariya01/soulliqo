import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Sweetindulgence = () => {
  const [boxCollections, setBoxCollections] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [firstCollectionId, setFirstCollectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const placeholder = process.env.PUBLIC_URL + "/images/category-placeholder.png";

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/categories`),          // ✅ BOX COLLECTIONS
      axios.get(`${API_BASE}/products/categories`)     // ✅ PRODUCT CATEGORIES
    ])
      .then(([boxRes, productRes]) => {
        const boxes = boxRes.data || [];
        setBoxCollections(boxes);
        setFirstCollectionId(boxes[0]?._id || null);

        setProductCategories(productRes.data.slice(-3) || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load categories");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" />
    </div>
  );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Header />

      {/* Banner */}
      <div className="chocolate-banner position-relative">
        <img src="/images/sweet.jpg" alt="Sweet Indulgence" className="w-100 h-50" />
        <h1 className="banner-text text-uppercase figtree-font">Sweet Indulgence</h1>
      </div>

      <Container className="my-5">
        <Row>
          {/* BOX COLLECTIONS */}
          {firstCollectionId && boxCollections.map((box) => (
            <Col key={box._id} xs={12} sm={6} md={4} className="mb-4">
              <Card
                as={NavLink}
                to={`/ownbox/${firstCollectionId}`}
                className="h-100 text-center border-0 shadow-sm text-decoration-none"
              >
                <Card.Img
                  variant="top"
                  src={box.image ? `${API_BASE}${box.image}` : placeholder}
                  alt={box.COLLECTION}
                  onError={(e) => (e.target.src = placeholder)}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-dark">{box.COLLECTION}</Card.Title>
                  <Card.Text className="text-muted small">Build Your Own Box</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {/* PRODUCT CATEGORIES */}
          {productCategories.map((cat) => (
            <Col key={cat.id} xs={12} sm={6} md={4} className="mb-4">
              <Card
                as={NavLink}
                to={`/products/${encodeURIComponent(cat.title)}`}
                className="h-100 text-center border-0 shadow-sm text-decoration-none"
              >
                <Card.Img
                  variant="top"
                  src={cat.img ? `${API_BASE}${cat.img}` : placeholder}
                  alt={cat.title}
                  onError={(e) => (e.target.src = placeholder)}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-dark">{cat.title}</Card.Title>
                  <Card.Text className="text-muted small">View Collection</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Sweetindulgence;
