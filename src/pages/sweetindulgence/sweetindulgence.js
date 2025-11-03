import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const Sweetindulgence = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/store/categories");
        // Ensure we always have an array
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <Header />

      {/* Banner */}
      <div
        className="banner d-flex align-items-center justify-content-center text-center container mt-2"
        style={{
          backgroundImage: `url('./images/sweet.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          color: "white",
          fontSize: "2.5rem",
          fontWeight: "600",
        }}
      >
        Sweet Indulgence
      </div>

      {/* Categories */}
      <Container className="my-5">
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          <Row>
            {categories.map((category, index) => (
              <Col key={category._id || index} xs={12} sm={6} md={3} className="mb-4">
                <Card
                  as={NavLink}
                  to={`/ownbox/${category._id || ""}`}
                  className="h-100 text-center border-0 shadow-sm text-decoration-none"
                  aria-label={`View ${category.name || "Category"} collection`}
                >
                  {/* Category Image */}
                  <Card.Img
                    variant="top"
                    src={category.image || "./images/category-placeholder.png"}
                    alt={category.name || "Category image"}
                    style={{ height: "180px", objectFit: "cover" }}
                  />

                  <Card.Body className="p-3">
                    <Card.Title className="fs-5 text-dark">
                      {category.name || "Unnamed Category"}
                    </Card.Title>
                    <Card.Text className="text-muted small">
                      {category.description || "No description available."}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Sweetindulgence;
