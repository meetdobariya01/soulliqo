import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const Refundandcancellation = () => {
  return (
    <div>
      {/* Header can be added here if needed */}
      <Header />

      <div className="terms-bg py-5">
        <div className="container">
          <motion.div
            className="text-center mb-5"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="fw-bold text-dark">Refund & Cancellation Policy</h1>
            <p className="text-muted">Last updated: November 2025</p>
          </motion.div>

          <motion.div
            className="card shadow-lg border-0 p-4 rounded-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* Order Cancellations */}
            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Order Cancellations</h3>
              <p>
                Orders can be canceled within <b>2 hours</b> of placing them.
                Once chocolates are packed or shipped, cancellations are no
                longer possible.
              </p>
              <p>
                To cancel, contact us at{" "}
                <a href="mailto:soulliqo@gmail.com">soulliqo@gmail.com</a> with
                your order ID.
              </p>
            </motion.section>

            {/* Refund Eligibility */}
            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Refund Eligibility</h3>
              <p>Refunds are applicable only in the following cases:</p>
              <ul>
                <li>Damaged, melted, or incorrect products received.</li>
                <li>
                  Non-delivery due to courier issues confirmed by tracking
                  records.
                </li>
              </ul>
            </motion.section>

            {/* Non-Refundable Cases */}
            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Non-Refundable Cases</h3>
              <ul>
                <li>
                  Change of mind or incorrect address provided by the customer.
                </li>
                <li>
                  Taste preferences or texture issues (as chocolate quality may
                  vary slightly due to temperature).
                </li>
                <li>Delay caused by courier or weather conditions.</li>
              </ul>
            </motion.section>

            {/* Refund Process */}
            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Refund Process</h3>
              <ul>
                <li>Raise a request within 48 hours of delivery.</li>
                <li>Include photos and order ID for verification.</li>
                <li>
                  Once approved, refunds are processed within 5–7 business days
                  via the original payment method.
                </li>
              </ul>
            </motion.section>

            {/* Replacement Option */}
            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Replacement Option</h3>
              <p>
                Instead of a refund, customers may choose a replacement shipment
                or store credit of equal value.
              </p>
            </motion.section>

            {/* Contact for Refunds */}
            <motion.section
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Contact for Refunds</h3>
              <p>
                For all refund or cancellation requests, email{" "}
                <a href="mailto:soulliqo@gmail.com">soulliqo@gmail.com</a> with
                <b> “Refund Request - [Order ID]”</b> as the subject.
              </p>
            </motion.section>
          </motion.div>
        </div>
      </div>

      {/* Footer can be added here if needed */}
      <Footer />
    </div>
  );
};

export default Refundandcancellation;
