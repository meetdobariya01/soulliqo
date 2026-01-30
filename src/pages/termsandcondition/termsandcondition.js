import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";

const Termsandcondition = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth"
    });
  }, [pathname]);
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
            <h1 className="fw-bold text-dark">Terms & Conditions</h1>
            <p className="text-muted">Last updated: November 2025</p>
          </motion.div>

          <motion.div
            className="card shadow-lg border-0 p-4 rounded-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Introduction</h3>
              <p>
                Welcome to <b>Soulliqo</b>. By accessing or purchasing from our
                website (<a href="https://www.soulliqo.com">www.soulliqo.com</a>
                ), you agree to these Terms & Conditions. Please read them
                carefully before using our site or placing an order.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Products and Services</h3>
              <p>
                We specialize in handmade chocolates, truffles, and
                confectionery. All images on the site are for representation
                purposes only. Actual products may slightly vary in appearance,
                color, and packaging.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Pricing and Payment</h3>
              <ul>
                <li>
                  Prices are displayed in Indian Rupees (INR) and are inclusive
                  of applicable taxes unless stated otherwise.
                </li>
                <li>
                  We reserve the right to update prices or promotional offers
                  without prior notice.
                </li>
                <li>
                  Payments are processed securely via our third-party payment
                  gateway (e.g., Razorpay). We do not store your credit or debit
                  card details.
                </li>
              </ul>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Shipping & Delivery</h3>
              <ul>
                <li>Orders are usually dispatched within 1–3 business days.</li>
                <li>
                  Delivery times vary depending on location and courier partner
                  performance.
                </li>
                <li>
                  You’ll receive an email or SMS confirmation once your order
                  ships.
                </li>
                <li>
                  We are not responsible for delays due to unforeseen
                  circumstances like weather, strikes, or courier issues.
                </li>
              </ul>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">
                Returns, Refunds & Replacements
              </h3>
              <p>
                Due to the perishable nature of chocolates, returns are only
                accepted if:
              </p>
              <ol>
                <li>The product was damaged or melted upon arrival, or</li>
                <li>You received the wrong item.</li>
              </ol>
              <p>
                You must notify us within 48 hours of delivery with a photo
                proof at{" "}
                <a href="mailto:soulliqo@gmail.com">soulliqo@gmail.com</a>. Once
                verified, we will issue a replacement or store credit.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Intellectual Property</h3>
              <p>
                All images, text, graphics, and trademarks displayed are the
                property of <b>Soulliqo</b>. Unauthorized use or reproduction is
                strictly prohibited.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">
                Limitation of Liability
              </h3>
              <p>
                We are not liable for indirect, incidental, or consequential
                damages arising from the use or inability to use our products or
                services.
              </p>
            </motion.section>

            <motion.section
              className="mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Governing Law</h3>
              <p>
                These Terms are governed by the laws of India, and any disputes
                will be subject to the jurisdiction of Ahmedabad courts.
              </p>
            </motion.section>

            <motion.section
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="fw-semibold text-choco">Changes to Terms</h3>
              <p>
                We may revise these Terms periodically. Continued use of the
                site after updates indicates your acceptance.
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

export default Termsandcondition;
