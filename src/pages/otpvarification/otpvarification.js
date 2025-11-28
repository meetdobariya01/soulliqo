import React from "react";
import { Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Otpvarification = () => {
  return (
    <div>
      {/* Header Component */}
      <Header />

      <Container
        fluid
        className="d-flex flex-column justify-content-center align-items-center my-5 text-center"
        style={{
          backgroundColor: "#fff",
          color: "#6B553D",
          fontFamily: "Poppins, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Top Back Link */}
        <div className="position-absolute top-0 start-0 mt-4 ms-4">
          <NavLink
            to="/forgot-password"
            className="text-muted text-decoration-none"
            style={{ fontWeight: "500" }}
          >
            ← Find your account
          </NavLink>
        </div>

        {/* Animation Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2
            style={{
              fontWeight: "600",
              fontSize: "64px",
              marginBottom: "30px",
              color: "#A58756",
                fontFamily: "Tenor Sans",
            }}
          >
            OTP Verification
          </h2>

          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="d-flex justify-content-center align-items-center mb-3"
            style={{
              width: "80px",
              height: "80px",
              border: "2px solid #A58756",
              borderRadius: "50%",  
              margin: "0 auto",
            }}
          >
            <i
              className="bi bi-check-lg"
              style={{ fontSize: "40px", color: "#A58756" }}
            ></i>
          </motion.div>

          <h5 className="fw-bold mb-2" style={{ color: "#000" }}>
            Success!
          </h5>
          <p className="text-muted" style={{ fontSize: "16px", fontFamily: "Raleway" }}>
            Congratulations! You have been successfully authenticated.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              as={NavLink}
              to="/"
              className="border-0 w-100 py-2 mt-3"
              style={{
                maxWidth: "300px",
                background:
                  "linear-gradient(to right, #A58756, #C8A264, #8A7148)",
                color: "#fff",
                fontWeight: "600",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              Continue
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Footer Spacer */}
      <Footer />
    </div>
  );
};

export default Otpvarification;
