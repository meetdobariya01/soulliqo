import React, { useState, useRef, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Otppage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60); // 01:00 minutes
  const inputsRef = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Format timer mm:ss
  const formatTime = (t) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    // When all OTP digits are filled, navigate
    if (newOtp.every((num) => num !== "")) {
      setTimeout(() => navigate("/reset-password"), 500);
    }
  };

  const handleResend = () => {
    setTimer(150);
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0].focus();
    alert("New OTP sent!");
  };

  return (
    <div>
      {/* Header Component */}
      <Header />

      <Container
        fluid
        className="d-flex justify-content-center align-items-center my-5 bg-light"
      >
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="p-4  text-center"
          style={{ maxWidth: "420px", width: "100%" }}
        >
          {/* Back Link */}
          <div className="text-start mb-3">
            <NavLink
              to="/forgotpassword"
              className="text-muted text-decoration-none"
              style={{ fontWeight: "500" }}
            >
              ← Find your account
            </NavLink>
          </div>

          {/* Title */}
          <h2
            className="mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "600",
              color: "#b68a4b",
            }}
          >
            Check your email
          </h2>

          <p className="text-muted mb-4" style={{ fontSize: "14px", fontFamily: "Raleway" }}>
            Enter the code from the email we sent to <br />
            <strong>youremail@example.com</strong>
          </p>

          {/* Timer */}
          <div className="fw-bold mb-3" style={{ color: "#4a4a4a" }}>
            {formatTime(timer)}
          </div>

          {/* OTP Inputs */}
          <div className="d-flex justify-content-center gap-2 mb-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(e.target.value, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="text-center form-control"
                style={{
                  width: "45px",
                  height: "50px",
                  fontSize: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
            ))}
          </div>

          {/* Resend Link */}
          <p className="text-muted" style={{ fontSize: "14px" }}>
            I didn’t receive any code.{" "}
            <span
              onClick={handleResend}
              style={{ color: "#b68a4b", cursor: "pointer", fontWeight: "500" }}
            >
              RESEND
            </span>
          </p>

          {/* Verify Button */}
          <Button
            className="w-100 border-0 py-2 mt-2"
            style={{
              background: "linear-gradient(to right, #A58756, #C8A264, #8A7148)",
              fontWeight: "600",
            }}
            onClick={() => navigate("/otpvarification")}
          >
            Verify
          </Button>
        </motion.div>
      </Container>

      {/* Footer Spacer */}
      <Footer />
    </div>
  );
};

export default Otppage;
