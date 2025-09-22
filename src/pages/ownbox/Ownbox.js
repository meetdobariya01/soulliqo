import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  Modal,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const boxes = [
  {
    id: 1,
    img: "./images/ownbox1.png",
    title: "Box of 16",
    price: "₹2000",
    description: "A premium collection of 16 handcrafted chocolates.",
  },
  {
    id: 2,
    img: "./images/ownbox2.png",
    title: "Box of 21",
    price: "₹2900",
    description: "A luxury box of 21 assorted chocolates.",
  },
  {
    id: 3,
    img: "./images/ownbox3.png",
    title: "Box of 24",
    price: "₹3500",
    description: "A grand box of 24 artisanal chocolates.",
  },
];

const Ownbox = () => {
  const [show, setShow] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  const handleShow = (box) => {
    setSelectedBox(box);
    setShow(true);
  };

  const handleClose = () => setShow(false);
  return (
    <div>
      {/* Header */}
      <Header />

      <Container className="py-5">
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item className="box-title" href="/">
            HOME
          </Breadcrumb.Item>
          <Breadcrumb.Item className="box-header" active>
            BUILD YOUR OWN BOX
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Heading */}
        <h2 className="fw-bold text-center mb-2 box-main-header">
          CHOOSE YOUR CHOCOLATE BOX SIZE
        </h2>
        <p className="text-muted text-center mb-5 box-main-subheader">
          CHOOSE AMONGST THE DISTINCT OF CHOCOLATES TO CUSTOMIZE YOUR CHOCOLATE
          BOX
        </p>

        {/* Box Cards */}
        <Row className="g-4">
          {boxes.map((box) => (
            <Col xs={12} sm={6} md={4} key={box.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border box-card">
                  <Card.Img
                    variant="top"
                    src={box.img}
                    className="p-3"
                    style={{ objectFit: "contain", height: "250px" }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title className="fw-bold own-box-title">
                      {box.title}
                    </Card.Title>
                    <Card.Text className="fw-bold own-box-price">
                      {box.price}
                    </Card.Text>
                    <Button
                      className="w-100 fw-semibold py-2 select-item-btn"
                      style={{
                        backgroundColor: "#7B4B3A",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      onClick={() => handleShow(box)}
                    >
                      Select Item
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Modal for Item Selection */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedBox?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedBox?.img}
              alt={selectedBox?.title}
              className="img-fluid mb-3"
            />
            <p>{selectedBox?.description}</p>
            <h5 className="fw-bold">{selectedBox?.price}</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button
              as={NavLink}
              to="/boxproduct"
              style={{ backgroundColor: "#7B4B3A", border: "none" }}
            >
              Confirm Selection
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Ownbox;
