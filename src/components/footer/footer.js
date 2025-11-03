import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaFacebookMessenger,
  FaTwitter,
  FaInfinity,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";  
import "../../index.css";
const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <Container>
          <Row className="gy-4">
            {/* Logo & Address */}
            <Col md={4} sm={12}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img
                  src="/images/logo-footer.png"
                  alt="Soulliqo"
                  className="footer-logo"
                />
                <p className="footer-text">
                  A305, Aarohi Galleria, Opposite Gala Luxuria, South Bhopal,
                  Ahmedabad, Gujarat, 380015
                </p>
                <div className="footer-social">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://m.me"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFacebookMessenger />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaTwitter />
                  </a>
                  {/* Example internal route */}
                  <Link to="/infinity" aria-label="Infinity Page">
                    <FaInfinity />
                  </Link>
                </div>
              </motion.div>
            </Col>
            {/* Quick Links */}
            <Col md={4} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="footer-links"
              >
                <h5>Quick Links</h5>
                <ul>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Sign Up</Link></li>
                  <li><Link to="/shop">Shop</Link></li>
                  <li><Link to="/brand-journey">Brand Journey</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </motion.div>
            </Col>
            {/* Contact Info */}
            <Col md={4} sm={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="footer-contact"
              >
                <h5>Contact Us</h5>
                <p>
                  <FaPhoneAlt className="me-2" />
                  <a href="tel:6576839733">6576839733</a>
                </p>
                <p>
                  <FaEnvelope className="me-2" />
                  <a href="mailto:soulliqo@gmail.com">soulliqo@gmail.com</a>
                </p>
              </motion.div>
            </Col>
          </Row>
          {/* Bottom Line */}
          <Row className="mt-4">
            <Col className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="footer-bottom"
              >
                Copyright © Soulliqo 2025. All Rights Reserved.
              </motion.p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};
export default Footer;