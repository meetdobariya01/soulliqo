import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Signup = () => {
  const navigate = useNavigate(); // added

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";
    return newErrors;
  };

  // Handle signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setServerError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/user/signup",
        formData
      ); // adjust base URL
      if (res.status === 201) {
        // Redirect to Login page after successful signup
        navigate("/login");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    window.location.href = "/auth/google"; // redirect to backend Google auth
  };

  return (
    <div>
      <Header />

      <Container
        fluid
        className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
      >
        <Row className="w-100">
          <Col xs={12} md={6} lg={4} className="mx-auto p-4">
            <h2 className="text-center mb-4 sign-heading montserrat-font text-uppercase">
              Create an account
            </h2>

            {serverError && (
              <Alert variant="danger" className="text-center">
                {serverError}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formFirstName">
                <Form.Label className="figtree-font">First Name</Form.Label>
                <Form.Control
                  className="underline-input figtree-font"
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

              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label className="figtree-font">Last Name</Form.Label>
                <Form.Control
                  className="underline-input figtree-font"
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

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className="figtree-font">Email</Form.Label>
                <Form.Control
                  className="underline-input figtree-font"
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

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className="figtree-font">Password</Form.Label>
                <Form.Control
                  className="underline-input figtree-font"
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

              <Form.Group className="mb-4" controlId="formMobile">
                <Form.Label className="figtree-font">
                  Mobile (Optional)
                </Form.Label>
                <Form.Control
                  className="underline-input figtree-font"
                  type="text"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  isInvalid={!!errors.mobile}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mobile}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 mb-3"
                style={{
                  background: "#e2905e",
                  border: "none",
                  fontWeight: "600",
                  fontFamily: "Figtree",
                }}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Continue"
                )}
              </Button>
            </Form>
            <div className="text-center my-3">
              <span className="text-muted">──────── or ────────</span>
            </div>
            <Button
              variant="outline-secondary"
              className="w-100 mb-2 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
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
                style={{ color: "#e2905e", fontFamily: 'Figtree' }}
              >
                Sign in
              </a>
            </p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
export default Signup;
