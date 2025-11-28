import React, { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 🔹 Replace with your actual backend endpoint
      await axios.post("https://your-backend-api.com/send-otp", { email });

      setMessage("OTP sent successfully! Check your email.");
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* Header Component */}
      <Header />

      {/* Main Container */}
      <Container
        fluid
        className="d-flex justify-content-center align-items-center my-5 bg-light"
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="p-4  rounded  text-center"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          {/* Back Button */}
          <div className="text-start mb-3">
            <NavLink
              to="/login" // change to your desired route
              className="text-muted text-decoration-none"
              style={{
                fontWeight: "500",
                fontSize: "15px",
              }}
            >
              ← Find your account
            </NavLink>
          </div>

          {/* Title */}
          <h2
            className="mb-4"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "600",
              color: "#b68a4b",
              fontSize: "40px",
            }}
          >
            Forgot password
          </h2>

          {/* Form */}
          <Form onSubmit={handleSendOTP}>
            <Form.Group controlId="formEmail" className="text-start mb-4">
              <Form.Label style={{ fontWeight: "500" }}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-2 underline-input"
              />
            </Form.Group>

            <Button
              as={NavLink}
              to="/otppage" // 👉 your target route
              disabled={loading}
              className="w-100 border-0 py-2"
              style={{
                background:
                  "linear-gradient(to right, #A58756, #C8A264, #8A7148)",
                fontWeight: "600",
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Send OTP"}
            </Button>
          </Form>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-muted"
            >
              {message}
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Footer Spacer */}
      <Footer />
    </div>
  );
};

export default Forgotpassword;
