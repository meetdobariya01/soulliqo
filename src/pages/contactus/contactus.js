import React from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Contactus = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Contact Section */}
      <div className="container-fluid p-0">
        {/* Contact Heading */}
        <div className="container-fluid p-0">
          {/* Heading */}
          <div className="position-relative bg-light py-5">
            <motion.h2
              className="container fw-bold contact-heading"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Get In Touch With Us. <br /> We're Here To Assist You.
            </motion.h2>

            {/* Social Media Icons */}
            <div className="position-absolute top-50 end-0 translate-middle-y me-4 d-flex flex-column gap-3 text-dark">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="d-flex align-items-center justify-content-center border rounded-circle p-2"
              >
                <FaFacebookF />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="d-flex align-items-center justify-content-center border rounded-circle p-2"
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                className="d-flex align-items-center justify-content-center border rounded-circle p-2"
              >
                <FaTwitter />
              </motion.a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="container py-5 font">
            <motion.form
              className="row g-4 shadow p-4 rounded bg-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <div className="col-md-4">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control underline-input"
                  placeholder="Enter your name"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control underline-input"
                  placeholder="Enter your email"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control underline-input"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control underline-input"
                  rows="4"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <div className="col-12 text-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-outline-dark px-4"
                >
                  Leave us a message →
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-4">
          <iframe
            title="Live Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d36147.613086163736!2d72.43188067431639!3d23.018687399999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b75dc2923c9%3A0xea4ace8cca4d7738!2sAarohi%20galleria!5e1!3m2!1sen!2sin!4v1757329162566!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contactus;
