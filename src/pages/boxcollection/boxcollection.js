import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Boxcollection = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/store/categories")
      .then((res) => setCollections(res.data))
      .catch((err) => console.error("Collection error:", err));
  }, []);

  return (
    <div>
      <Header />

      <Container className="py-5">
        <h3 className="text-uppercase fw-bold mb-4">Box Collections</h3>
        <Row className="g-4">
          {collections.map((item) => (
            <Col key={item._id} xs={6} md={4} lg={3}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/ownbox/${item._id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={item.image}
                      alt={item.name}
                      className="img-fluid"
                    />

                    <Button
                      variant="light"
                      className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                    >
                      <i className="bi bi-heart"></i>
                    </Button>
                  </div>

                  <Card.Body>
                    <Card.Title className="fw-semibold mb-1 box-collection-title">
                      {item.name}
                    </Card.Title>

                    <Card.Text className="text-muted small">
                      {item.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Boxcollection;
