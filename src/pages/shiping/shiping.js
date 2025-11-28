import React from "react";
import { motion } from "framer-motion";
import "./shiping.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Shiping = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      <div className="policy-page">
        <motion.div
          className="policy-container"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          <h1 className="policy-title">Shipping Policy</h1>
          <p className="policy-updated">Last updated: November 2025</p>

          {/* INTRODUCTION */}
          <section>
            <h2>Introduction</h2>
            <p>
              Welcome to <strong>Soulliqo</strong>. By accessing or purchasing
              from our website, you agree to the policies below. Please read
              them carefully before placing an order.
            </p>
          </section>

          {/* SHIPPING */}
          <section>
            <h2>Shipping & Delivery</h2>
            <ul>
              <li>Orders are processed within 1–2 business days.</li>
              <li>
                Delivery times vary based on location, courier performance, and
                weather conditions.
              </li>
              <li>
                You’ll receive an email or SMS with tracking details once your
                order is shipped.
              </li>
              <li>
                Due to the perishable nature of chocolates, we pack orders with
                temperature-safe packaging during hot मौसम.
              </li>
              <li>
                We are not responsible for delays caused by couriers, strikes,
                or natural issues.
              </li>
            </ul>
          </section>

          {/* MELTING & WEATHER */}
          <section>
            <h2>Chocolate Melting Disclaimer</h2>
            <p>
              Chocolates are sensitive to heat. While we use insulated
              packaging, gel packs, and safe handling, we cannot fully guarantee
              protection from melting during extreme temperatures, especially in
              summer months.
            </p>
          </section>

          {/* RETURNS */}
          <section>
            <h2>Returns, Refunds & Replacements</h2>
            <p>
              Due to the perishable nature of chocolates, returns are only
              accepted if:
            </p>
            <ul>
              <li>The product arrived damaged or melted beyond use.</li>
              <li>The wrong item was delivered.</li>
            </ul>
            <p>
              You must notify us within <strong>24 hours</strong> of delivery
              along with photos or video proof at{" "}
              <a href="mailto:soulliqo@gmail.com">soulliqo@gmail.com</a>.
            </p>
          </section>

          {/* INTERNATIONAL SHIPPING */}
          <section>
            <h2>International Shipping</h2>
            <p>
              Yes, we ship internationally. However, delivery times and melting
              risks may increase. Customs delays are not under our control.
            </p>
          </section>

          {/* LIMITATION */}
          <section>
            <h2>Limitation of Liability</h2>
            <p>
              We are not responsible for indirect, incidental, or consequential
              damages due to courier delays or melting during transit.
            </p>
          </section>

          {/* LAW */}
          <section>
            <h2>Governing Law</h2>
            <p>
              These policies are governed by Indian law and fall under the
              jurisdiction of Ahmedabad courts.
            </p>
          </section>

          {/* CHANGES */}
          <section>
            <h2>Changes to Policy</h2>
            <p>
              We may update this Shipping Policy periodically. Continued use of
              our website indicates your acceptance.
            </p>
          </section>
        </motion.div>
      </div>

      {/* Footer could go here if needed */}
      <Footer />
    </div>
  );
};

export default Shiping;
