import React, { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import axios from "axios"; // for API calls
const Contactus = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState(""); // success/error message
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api.soulliqo.com/contact/",
        formData
      );
      setStatus(response.data.success);
      setFormData({ name: "", email: "", phone: "", message: "" }); // reset form
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.error || "Server error, try again later.");
    }
  };
  return (
    <div>
      <Header />
      {/* Contact Section */}
      <div className="container-fluid p-0">
        <div className="position-relative bg-light py-5">
          <motion.h2
            className="container montserrat-font text-uppercase contact-heading"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get In Touch With Us. <br /> We're Here To Assist You.
          </motion.h2>
          {/* Social Media Icons */}
          <div className="position-absolute top-50 end-0 translate-middle-y me-4 d-flex flex-column gap-3 text-dark mt-4">
            <motion.a
              href="https://www.facebook.com/thesoulliqo"
              target="blank"
              whileHover={{ scale: 1.2 }}
              className="social-icon"
            >
              <FaFacebookF />
            </motion.a>

            <motion.a
              href="https://www.instagram.com/soulliqo/"
              target="blank"
              whileHover={{ scale: 1.2 }}
              className="social-icon"
            >
              <FaInstagram />
            </motion.a>

            <motion.a
              href="mailto:soulliqo@gmail.com"
              whileHover={{ scale: 1.2 }}
              className="social-icon"
            >
              <FaEnvelope />
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
            onSubmit={handleSubmit}
          >
            {status && <div className="col-12 alert alert-info">{status}</div>}
            <div className="col-md-4">
              <label className="form-label figtree-font ">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control figtree-font underline-input"
                placeholder="Enter your name"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label figtree-font figtree-font ">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control figtree-font underline-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label figtree-font ">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control figtree-font underline-input"
                placeholder="Enter phone number"
              />
            </div>
            <div className="col-12">
              <label className="form-label figtree-font">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control figtree-font underline-input"
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
      <Footer />
    </div>
  );
};
export default Contactus;
