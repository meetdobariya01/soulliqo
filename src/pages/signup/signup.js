import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation
  const validate = () => {
    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
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
      console.log("Signup Data:", formData);
    } else {
      setErrors(newErrors);
      setSubmitted(false);
    }
  };
  return (
    <div>
      {/* Header Section */}
      <Header />

      {/* Signup Form Section */}
       <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto p-4">
          <h2
            className="text-center mb-4 create-account"
            style={{ color: "#a18146", fontWeight: "600", fontSize: "40px" }}
          >
            Create an account
          </h2>

          {submitted && (
            <Alert variant="success" className="text-center">
              Signup Successful 🎉
            </Alert>
          )}

          <Form className="form-font" onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName" className="mb-3 ">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                className="underline-input"
                type="text"
                name="firstName"
                placeholder="Enter your First Name"
                value={formData.firstName}
                onChange={handleChange}
                isInvalid={!!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                className="underline-input"
                type="text"
                name="lastName"
                placeholder="Enter your Last Name"
                value={formData.lastName}
                onChange={handleChange}
                isInvalid={!!errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
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
              <Form.Label>Password</Form.Label>
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
              type="submit"
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
            <span className="text-muted">──────── or ────────</span>
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
            Already have an account?{" "}
            <a
              href="/login"
              className="text-decoration-none"
              style={{ color: "#a18146" }}
            >
              Sign in
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

export default Signup;
