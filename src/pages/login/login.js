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
import "../../index.css";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };
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
        "http://localhost:5000/user/login",
        formData
      ); // adjust base URL if needed
      const { token, role, userId } = res.data;
      // store token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      navigate("/"); // redirect after login
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };
  return (
    <div>
      <Header />
      <Container
        fluid
        className="d-flex align-items-center justify-content-center min-vh-100"
      >
        <Row className="w-100">
          <Col xs={12} md={6} lg={4} className="mx-auto p-4 rounded bg-white">
            <h2
              className="text-center mb-4 Login-font montserrat-font text-uppercase"
            >
              Login
            </h2>
            {serverError && (
              <Alert variant="danger" className="text-center">
                {serverError}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="form-font figtree-font ">Email</Form.Label>
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
              <Form.Group controlId="formPassword" className="mb-4">
                <Form.Label className="form-font figtree-font">Password</Form.Label>
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
              <Button
                type="submit"
                className="w-100 mb-3 figtree-font "
                style={{
                  background: "#e2905e",
                  border: "none",
                  fontWeight: "600",
                  fontFamily: 'Figtree',
                }}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Continue"
                )}
              </Button>
            </Form>

            <div className="text-center mb-3">
              <a
                href="/forgotpassword" // change to your route
                className="text-decoration-none text-danger"
                style={{fontWeight: "500" }}
              >
                Forgot Password
              </a>
            </div>

            <div className="text-center my-3">
              <span className="text-muted">or</span>
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
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-decoration-none"
                style={{ color: "#e2905e", fontFamily: 'Figtree' }}
              >
                Create one
              </a>
            </p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
export default Login;
