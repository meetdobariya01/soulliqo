import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "../../index.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form
  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setErrors({});
      console.log("Login Data:", formData);
    } else {
      setErrors(newErrors);
      setSubmitted(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Login Form Section */}
      <Container
        fluid
        className="d-flex align-items-center justify-content-center min-vh-100 "
      >
        <Row className="w-100">
          <Col xs={12} md={6} lg={4} className="mx-auto p-4  rounded bg-white">
            <h2
              className="text-center mb-4 Login-font"
              style={{ color: "#a18146", fontWeight: "600" }}
            >
              Login
            </h2>

            {submitted && (
              <Alert variant="success" className="text-center">
                Login Successful 🎉
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="form-font">Email</Form.Label>
                <Form.Control
                  className="underline-input"
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-4">
                <Form.Label className="form-font">Password</Form.Label>
                <Form.Control
                  className="underline-input"
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                as={Link}
                to="/afterlogin" // <-- set your route here
                className="w-100 mb-3"
                style={{
                  background: "linear-gradient(to right, #b68a4b, #94723b)",
                  border: "none",
                }}
              >
                Continue
              </Button>
            </Form>

            <div className="text-center my-3">
              <span className="text-muted">or</span>
            </div>

            <Button
              variant="outline-secondary"
              className="w-100 mb-2 d-flex align-items-center justify-content-center"
            >
              <FcGoogle className="me-2" /> Continue with Google
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100 mb-3 d-flex align-items-center justify-content-center"
            >
              <FaApple className="me-2" /> Continue with Apple
            </Button>

            <p className="text-center mt-3">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-decoration-none"
                style={{ color: "#a18146" }}
              >
                Create one
              </a>
            </p>
          </Col>
        </Row>
      </Container>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Login;
