import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Reletedproduct = ({ category, currentProductId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const Api = process.env.REACT_APP_API_URL; // ✅ base API path

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      try {
        const res = await fetch(
          `${Api}/products?category=${encodeURIComponent(category)}`
        );
        const data = await res.json();
        const filtered = data.filter((p) => p._id !== currentProductId);
        setProducts(filtered.slice(0, 4)); // show max 4 related products
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    fetchProducts();
  }, [category, currentProductId]);

  const handleClick = (id) => navigate(`/product/${id}`);

  if (!products.length) return null;

  return (
    <section className="py-5">
      <Container>
        <h5 className="mb-4 mt-5 releted-title">Related Products</h5>
        <Row>
          {products.map((product) => {
            // ✅ handle both array and comma-separated image strings
            const imageUrl = Array.isArray(product.image)
              ? `${Api}${product.image[0]}`
              : typeof product.image === "string"
              ? `${Api}${product.image.split(",")[0].trim()}`
              : "/placeholder.jpg";

            return (
              <Col
                key={product._id}
                md={3}
                sm={6}
                xs={6}
                className="mb-4 animate__animated animate__zoomIn"
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(product._id)}
              >
                <Card className="h-100 shadow-sm border-0 product-card">
                  <Card.Img
                    variant="top"
                    src={imageUrl}
                    alt={product.name}
                    className="product-img"
                    onError={(e) => (e.target.src = "/placeholder.jpg")} // fallback if image missing
                  />
                  <Card.Body>
                    <Card.Title className="fs-6 text-truncate product-details">
                      {product.name}
                    </Card.Title>
                    <Card.Text className="mb-1 product-details">
                      {product.weight}
                    </Card.Text>
                    <Card.Text>
                      {product.oldPrice && (
                        <span className="text-muted text-decoration-line-through me-2">
                          ₹{product.oldPrice}
                        </span>
                      )}
                      <span className="fw-bold">₹{product.price}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default Reletedproduct;
