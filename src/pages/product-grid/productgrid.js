import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Heart } from "react-bootstrap-icons";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Productgrid = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_BASE}/products`;
        if (category) url += `?category=${encodeURIComponent(category)}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  // ✅ Universal image resolver
  const getImageUrl = (img) => {
    if (!img) return "/placeholder.jpg";

    // If array, take first
    if (Array.isArray(img)) img = img[0];

    // If CSV string, take first
    if (typeof img === "string" && img.includes(",")) {
      img = img.split(",")[0].trim();
    }

    // Fix missing slash
    if (typeof img === "string" && !img.startsWith("http") && !img.startsWith("/")) {
      img = "/" + img;
    }

    // Return full URL
    if (typeof img === "string" && img.startsWith("http")) return img;
    return `${API_BASE}${img}`;
  };

  return (
    <div>
      <Header />
      <Container className="py-5">
        <h2 className="mb-4 text-center text-uppercase">
          {category || "All Products"}
        </h2>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center my-5">
            <p>No products found.</p>
          </div>
        ) : (
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
                <Card className="h-100 shadow-sm position-relative border-0">
                  <div className="wishlist-icon position-absolute top-0 end-0 p-2">
                    <Heart color="#7B4B3A" />
                  </div>

                  <NavLink
                    to={`/product/${product._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <Card.Img
                      variant="top"
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/300x300?text=No+Image")
                      }
                      style={{
                        height: "200px",
                        width: "100%",
                        objectFit: "contain",
                        padding: "10px",
                        borderRadius: "12px",
                      }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="fs-6 text-truncate mb-1">
                        {product.name}
                      </Card.Title>
                      <p className="text-muted small mb-1">
                        {product.weight || "Weight not specified"}
                      </p>
                      <p className="fw-bold mb-0">₹{product.price}</p>
                    </Card.Body>
                  </NavLink>
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

export default Productgrid;
