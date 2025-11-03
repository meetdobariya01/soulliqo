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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:5000/products";
        if (category) url += `?category=${encodeURIComponent(category)}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

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
                <Card className="h-100 position-relative">
                  <div className="wishlist-icon position-absolute top-0 end-0 p-2">
                    <Heart />
                  </div>

                  <NavLink to={`/product/${product._id}`} className="text-decoration-none text-dark">
                    <Card.Img variant="top" src={product.image || "./images/product-grid.png"} />
                    <Card.Body className="text-center">
                      <Card.Title>{product.name}</Card.Title>
                      <p>{product.weight || "Wt. —"}</p>
                      <p className="fw-bold">₹{product.price}</p>
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
