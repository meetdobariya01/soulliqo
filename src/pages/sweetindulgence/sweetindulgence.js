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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const placeholder = process.env.PUBLIC_URL + "/images/own-box.jpg";

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/categories`),        // Box collections
      axios.get(`${API_BASE}/products/categories`)   // Product categories
    ])
      .then(([boxRes, productRes]) => {
        setBoxCollections(Array.isArray(boxRes.data) ? boxRes.data : []);
        setProductCategories(
          Array.isArray(productRes.data)
            ? productRes.data.slice(0, 3)
            : []
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load categories");
        setLoading(false);
      });
  }, []);

  // ✅ Manual image selector for product categories
  const getProductImage = (cat) => {
    switch ((cat.title || "").toUpperCase()) {
      case "BONBON":
        return "/images/bonbon/soulliqo/BonBonCoverPic.webp";
      case "TRUFFLE":
        return "/images/bonbon/E-com/STYLED_TRUFFLE.webp";
      case "PRALINE":
        return "/images/bonbon/E-com/STYLED_PRALINE.webp";
      default:
        return cat.img || placeholder;
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Header />

      {/* Banner */}
      <div className="chocolate-banner position-relative">
        <img
          src="/images/HandCraftedArtisanChocolates.webp"
          alt="Sweet Indulgence"
          className="w-100 h-50"
        />
        <h1 className="banner-text text-uppercase figtree-font">
          Sweet Indulgence
        </h1>
      </div>

      <Container className="my-5">
        <Row>
          {/* BOX COLLECTIONS */}
          {boxCollections.map((box) => (
            <Col key={box._id} xs={12} sm={6} md={4} className="mb-4">
              <Card
                as={NavLink}
                to={`/ownbox/${box._id}`}
                className="h-100 text-center border-0 shadow-sm text-decoration-none"
              >
                <Card.Img
                  variant="top"
                  src={box.image || placeholder}
                  alt={box.name}
                  onError={(e) => (e.target.src = placeholder)}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-dark">
                    {box.name}
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    Build Your Own Box
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {/* PRODUCT CATEGORIES */}
          {productCategories.map((cat) => (
            <Col key={cat._id || cat.title} xs={12} sm={6} md={4} className="mb-4">
              <Card
                as={NavLink}
                to={`/products/${encodeURIComponent(cat.title)}`}
                className="h-100 text-center border-0 shadow-sm text-decoration-none"
              >
                <Card.Img
                  variant="top"
                  src={getProductImage(cat)}
                  alt={cat.title}
                  onError={(e) => (e.target.src = placeholder)}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fs-6 text-dark">
                    {cat.title}
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    View Collection
                  </Card.Text>
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
