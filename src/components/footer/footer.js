import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebook,
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
                  src="/images/original-logo.png"
                  alt="Soulliqo"
                  className="footer-logo"
                />
                <p className="footer-text figtree-font ">
                  A305, Aarohi Galleria, Opposite Gala Luxuria,
                  <br /> South Bopal, Ahmedabad, Gujarat, 380058
                </p>
                <div className="footer-social">
                  <a
                    href="https://www.instagram.com/soulliqo/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram />
                  </a>

                  <a
                    href="https://www.facebook.com/thesoulliqo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaFacebook />
                  </a>

                  <a
                    href="mailto:soulliqo@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaEnvelope />
                  </a>
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
                <h5 className="figtree-font ">Quick Links</h5>
                <ul className="figtree-font ">
                  <li>
                    <Link to="/shiping">Shipping Policy</Link>
                  </li>
                  <li>
                    <Link to="/terms-and-condition">Terms & Conditions</Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">Privacy policy</Link>
                  </li>
                  <li>
                    <Link to="/refund-and-cancellation">
                      Refund & Cancellation Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/faqs">FAQs</Link>
                  </li>
                  <li>
                    <Link to="/contactus">Contact Us</Link>
                  </li>
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
                <h5 className=" figtree-font">Contact Us</h5>
                <p>
                  <FaPhoneAlt className="me-2  figtree-font" style={{ color: "#f0dfc9" }}/>
                  <a href="tel:9727716480">9727716480</a>
                </p>
                <p>
                  <FaPhoneAlt className="me-2  figtree-font" style={{ color: "#f0dfc9" }}/>
                  <a href="tel:9925587624">9925587624</a>
                </p>
                <p>
                  <FaEnvelope className="me-2 figtree-font" style={{ color: "#f0dfc9" }}/>
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
