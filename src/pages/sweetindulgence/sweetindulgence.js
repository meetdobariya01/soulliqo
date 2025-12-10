import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import axios from "axios";

const Sweetindulgence = () => {
  const products = [
    {
      id: 1,
      title: "Bon Bon",
      image: "./images/bon-bon.jpg", // replace with real image
      link: "/ownbox",
    },
    {
      id: 2,
      title: "Truffle",
      image: "./images/truffle.png", // replace with real image
      link: "/boxcollection",
    },
    {
      id: 3,
      title: "Pralines",
      image: "./images/pralines.png", // replace with real image
      link: "/boxcollection",
    },
    {
      id: 4,
      title: "Dragees",
      image: "./images/dragees.jpg", // replace with real image
      link: "/boxcollection",
    },
  ];
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/store/categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [API_BASE_URL]);

  // ✅ Use image from /public/images (React automatically serves from /public)
  const placeholder = process.env.PUBLIC_URL + "/images/category-placeholder.png";

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
        {/* Sweet Indulgence */}
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
            {categories.map((category, index) => {
              const imageSrc = category.image
                ? category.image.startsWith("http")
                  ? category.image
                  : `${API_BASE_URL}${category.image.startsWith("/") ? category.image : `/images/${category.image}`}`
                : placeholder;

              return (
                <Col key={category._id || index} xs={12} sm={6} md={3} className="mb-4">
                  <Card
                    as={NavLink}
                    to={`/ownbox/${category._id || ""}`}
                    className="h-100 text-center border-0 shadow-sm text-decoration-none"
                    aria-label={`View ${category.name || "Category"} collection`}
                  >
                    <Card.Img
                      variant="top"
                      src={imageSrc}
                      alt={category.name || "Category image"}
                      onError={(e) => (e.target.src = placeholder)}
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
              );
            })}
          </Row>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Sweetindulgence;
