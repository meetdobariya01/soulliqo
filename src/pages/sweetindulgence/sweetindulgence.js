import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Sweetindulgence = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const placeholder = process.env.PUBLIC_URL + "/images/category-placeholder.png";

  useEffect(() => {
    axios
      .get(`${API_BASE}/products/categories`)
      .then((res) => {
        const lastThree = res.data.slice(-3); // ✅ only last 3
        setCategories(lastThree);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load categories");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header />

      {/* Banner */}
      <div
        className="banner d-flex align-items-center justify-content-center text-center  mt-2"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + "/images/sweet.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "600px",
          color: "white",
          fontSize: "2.5rem",
          fontWeight: "600",
        }}
      >
        Sweet Indulgence
      </div>

      <Container className="my-5">
        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {categories.map((category) => (
            <Col key={category._id} xs={12} sm={6} md={4} className="mb-4">
              <Card
                as={NavLink}
                to={`/products/${encodeURIComponent(category.title)}`}
                className="h-100 text-center border-0 shadow-sm text-decoration-none"
              >
                <Card.Img
                  variant="top"
                  src={
                    category.img
                      ? `${API_BASE}${category.img}`
                      : placeholder
                  }
                  alt={category.title}
                  onError={(e) => (e.target.src = placeholder)}
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <Card.Body className="p-3">
                  <Card.Title className="fs-6 text-dark">
                    {category.title}
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
