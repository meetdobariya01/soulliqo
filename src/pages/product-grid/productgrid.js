import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Heart } from "react-bootstrap-icons"; // Bootstrap icon
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
const products = [
  {
    id: 1,
    title: "Tiramisu",
    weight: "Wt. 75gm",
    price: "₹345",
    oldPrice: "₹499",
    img: "./images/product-grid.png",
    link: "/productdetails",
  },
  {
    id: 2,
    title: "Mango Habanero Chili",
    weight: "Wt. 75gm",
    price: "₹345",
    oldPrice: "₹499",
    img: "./images/product-grid.png",
    link: "/productdetails",
  },
  {
    id: 3,
    title: "Choco Hazelnut Bliss",
    weight: "Wt. 75gm",
    price: "₹345",
    oldPrice: "₹499",
    img: "./images/product-grid.png",
    link: "/productdetails",
  },
  {
    id: 4,
    title: "Exotic Fruits & Nuts",
    weight: "Wt. 75gm",
    price: "₹345",
    oldPrice: "₹499",
    img: "./images/product-grid.png",
    link: "/productdetails",
  },
];

const Productgrid = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      <Container className="py-5">
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product.id} xs={6} sm={6} md={4} lg={3}>
              <Card className="product-card h-100">
                {/* Wishlist Heart */}
                <div className="wishlist-icon">
                  <Heart />
                </div>

                {/* Product Content */}
                <NavLink
                  to={product.link}
                  className="text-decoration-none text-dark"
                >
                  <div className="product-img-wrapper">
                    <Card.Img
                      variant="top"
                      src={product.img}
                      alt={product.title}
                      className="product-img"
                    />
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fs-6 product-title-grid">{product.title}</Card.Title>
                    <p className="mb-1 text-muted product-title-grid">{product.weight}</p>
                    <p className="mb-0">
                      <span className="old-price">{product.oldPrice}</span>{" "}
                      <span className="price fw-bold">{product.price}</span>
                    </p>
                  </Card.Body>
                </NavLink>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Productgrid;
