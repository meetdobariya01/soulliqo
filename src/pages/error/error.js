import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "./error.css";

const Error = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      <div className="error-wrapper">
        {/* Chocolate Drip Animation */}
        <div className="drip"></div>
        <div className="drip2"></div>
        <div className="drip3"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="error-content"
        >
          <h1 className="error-title">404</h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="error-subtitle"
          >
            Oops! This chocolate melted away 🍫
          </motion.h2>

          <p className="error-text">
            The page you're searching for has either been eaten or doesn’t
            exist.
          </p>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="error-btn">
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Error;
