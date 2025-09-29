import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Sweetindulgence = () => {
  const products = [
    {
      id: 1,
      title: "Bon Bon",
      image: "./images/bon-bon.jpg", // replace with real image
      link: "/bonbon",
    },
    {
      id: 2,
      title: "Truffle",
      image: "./images/truffle.png", // replace with real image
      link: "/truffle",
    },
    {
      id: 3,
      title: "Pralines",
      image: "./images/pralines.png", // replace with real image
      link: "/pralines",
    },
    {
      id: 4,
      title: "Dragees",
      image: "./images/dragees.jpg", // replace with real image
      link: "/dragees",
    },
  ];
  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Banner Section */}
      <div
        className="banner d-flex align-items-center justify-content-center text-center container mt-2   "
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
        {/* Sweet Indulgence */}
      </div>

      {/* Product Section */}
      <Container className="my-5">
        <Row>
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={3} className="mb-4">
              <NavLink to={product.link} style={{ textDecoration: "none" }}>
                <Card className="h-100 text-center border-0 shadow-sm product-card">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.title}
                    className="img-fluid"
                  />
                  <Card.Body className="p-2">
                    <Card.Title className="text-dark fs-6">
                      {product.title}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </NavLink>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Sweetindulgence;
