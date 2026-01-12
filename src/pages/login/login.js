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
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

// Backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const mergeGuestCart = async (token) => {
    const guestCartRaw = Cookies.get("guestCart");
    if (guestCartRaw) {
      const guestCart = JSON.parse(guestCartRaw);
      if (guestCart?.items?.length) {
        await axios.post(
          `${API_BASE_URL}/cart/merge`,
          { guestItems: guestCart.items },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Cookies.remove("guestCart");
      }
    }
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
      const res = await axios.post(`${API_BASE_URL}/user/login`, formData);
      const { token, role, userId } = res.data;
      if (!token) throw new Error("Login failed");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      await mergeGuestCart(token);
      navigate("/cart");
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/google-login`, {
        credential: res.credential,
      });
      const { token, role, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      await mergeGuestCart(token);
      navigate("/cart");
    } catch (err) {
      console.error(err);
      setServerError("Google login failed");
    }
  };

  const handleGoogleError = () => setServerError("Google login failed");

  return (
    <div>
      <Header />
      <Container
        fluid
        className="d-flex align-items-center justify-content-center min-vh-100"
      >
        <Row className="w-100">
          <Col xs={12} md={6} lg={4} className="mx-auto p-4 rounded bg-white">
            <h2 className="text-center mb-4 Login-font montserrat-font text-uppercase">
              Login
            </h2>

            {/* Google Login */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="100%"
            />
            <div className="text-center my-3">
              <span className="text-muted">──────── or ────────</span>
            </div>

            {serverError && (
              <Alert variant="danger" className="text-center">
                {serverError}
              </Alert>
            )}

            {/* Login Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="form-font figtree-font">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  className="underline-input"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-font figtree-font">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  className="underline-input"
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
                className="w-100 mb-3 figtree-font"
                style={{ background: "#e2905e", border: "none", fontWeight: "600" }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Continue"}
              </Button>
            </Form>

            <div className="text-center mb-3">
              <a
                href="/forgotpassword"
                className="text-decoration-none text-danger"
                style={{ fontWeight: "500" }}
              >
                Forgot Password
              </a>
            </div>

            <p className="text-center mt-3">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-decoration-none"
                style={{ color: "#e2905e" }}
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
