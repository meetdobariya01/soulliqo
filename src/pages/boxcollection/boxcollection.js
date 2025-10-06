import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Boxcollection = () => {
  const products = [
    {
      id: 1,
      title: "Box of 7",
      img: "/images/ownbox1.png",
      price: 345,
      oldPrice: 499,
      offer: "Rakhi Special Offer",
      link: "/productdetails",
    },
    {
      id: 2,
      title: "Box of 9",
      img: "/images/ownbox1.png",
      price: 345,
      oldPrice: 499,
      offer: "Rakhi Special Offer",
      link: "/productdetails",
    },
    {
      id: 3,
      title: "Box of 12",
      img: "/images/ownbox1.png",
      price: 345,
      oldPrice: 499,
      offer: "Rakhi Special Offer",
      link: "/productdetails",
    },
    {
      id: 4,
      title: "Box of 16",
      img: "/images/ownbox1.png",
      price: 345,
      oldPrice: 499,
      offer: "Rakhi Special Offer",
      link: "/productdetails",
    },
    {
      id: 5,
      title: "Box of 21",
      img: "/images/ownbox1.png",
      price: 345,
      oldPrice: 499,
      offer: "Rakhi Special Offer",
      link: "/productdetails",
    },
    {
      id: 6,
      title: "Box of 24",
      img: "/images/ownbox1.png",
      price: 345,
      oldPrice: 499,
      offer: "Rakhi Special Offer",
      link: "/productdetails",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <Header />

      <Container className="py-5">
        <h3 className="text-uppercase fw-bold mb-4">Box Collections</h3>
        <Row className="g-4">
          {products.map((item) => (
            <Col key={item.id} xs={6} md={4} lg={3}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={item.link} className="text-decoration-none text-dark">
                  <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={item.img}
                        alt={item.title}
                        className="img-fluid"
                      />
                      {item.offer && (
                        <span
                          className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1 small fw-semibold"
                          style={{ borderBottomRightRadius: "8px" }}
                        >
                          {item.offer}
                        </span>
                      )}
                      <Button
                        variant="light"
                        className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                      >
                        <i className="bi bi-heart"></i>
                      </Button>
                    </div>
                    <Card.Body className="">
                      <Card.Title className="fw-semibold mb-1 box-collection-title">
                        {item.title}
                      </Card.Title>
                      <Card.Text className="mb-0">
                        <del className="text-muted me-2">₹{item.oldPrice}</del>
                        <strong>₹{item.price}</strong>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default Boxcollection;
