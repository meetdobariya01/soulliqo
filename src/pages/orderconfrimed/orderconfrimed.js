import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";

import Footer from "../../components/footer/footer";

const Orderconfrimed = () => {
  return (
    <div>
      {/* HEADER */}
      <Header />

      <Container
        className="d-flex justify-content-center align-items-center py-5"
        style={{ minHeight: "100vh" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-100"
        >
          <Card
            className="p-4 border-0 shadow-sm rounded-4 mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="mb-3"
              >
                <div
                  className="mx-auto rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "70px",
                    height: "70px",
                    backgroundColor: "#D9C6AA",
                  }}
                >
                  <i
                    className="bi bi-check2"
                    style={{ fontSize: "40px", color: "#7B4B3A" }}
                  ></i>
                </div>
              </motion.div>
              <h3
                className="fw-semibold montserrat-font"
                style={{
                  color: "#A58756",
                  fontWeight: "400",
                }}
              >
                Order Confirmed
              </h3>
              <p className="text-muted oreder-confirm-text figtree-font">
                You will get an order confirmation mail/SMS shortly with the
                expected delivery date for your items.
              </p>
            </div>

            <motion.div
              className="border rounded-4 p-3 d-flex align-items-center justify-content-between figtree-font"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="oreder-confirm-text" style={{ flex: 1 }}>
                <p className="mb-1 fw-semibold">Delivering to:</p>
                <p className="mb-1">
                  Itisha Agarwal | <strong>6378822540</strong>
                </p>
                <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                  112/111 lorem ipsum jonain insaini ncdinsuijscjnd njsnind
                  nijsinuapi dfsvdvrsbgt lorem ipsum dolor sit amet.
                </p>
              </div>
              <img
                src="https://www.emoji.co.uk/files/phantom-open-emojis/travel-places-phantom/12675-racing-motorcycle.png"
                alt="delivery"
                className="ms-3"
                style={{ width: "110px", height: "110px" }}
              />
            </motion.div>

            <div className="text-center mt-4">
              <Button
                as={NavLink}
                to="/orders" // 👉 replace with your actual route
                variant="dark"
                style={{
                  backgroundColor: "#7B4B3A",
                  border: "none",
                  padding: "10px 25px",
                  fontFamily: "Poppins",
                }}
                className="me-2"
              >
                Order Details
              </Button>

              <Button
                as={NavLink}
                className="mt-md-0 mt-3"
                to="/" // 👉 replace with your actual route
                variant="outline-secondary"
                style={{
                  borderColor: "#7B4B3A",
                  color: "#7B4B3A",
                  fontFamily: "Poppins",
                  padding: "10px 25px",
                }}
              >
                Continue Shopping
              </Button>
            </div>
          </Card>
        </motion.div>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Orderconfrimed;
