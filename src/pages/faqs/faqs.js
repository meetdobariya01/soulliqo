import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Accordion } from "react-bootstrap";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "../../index.css";

const sectionVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 },
  }),
};

const Faqs = () => {
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
      {/* Header Space */}
      <Header />

      <section className="premium-faq">
        <Container>
          {/* Heading */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariant}
            className="text-center mb-5"
          >
            <h1 className="premium-title montserrat-font">
              Frequently Asked Questions
            </h1>
            <p className="premium-subtitle montserrat-font">
              Everything you need to know about our chocolates, delivery &
              customization
            </p>
          </motion.div>

          {/* GENERAL QUESTIONS */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="faq-section-title montserrat-font">
              General Questions
            </h2>

            <Accordion className="montserrat-font">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  How do I store chocolates so they stay perfect?
                </Accordion.Header>
                <Accordion.Body>
                  We recommend storing our chocolates at a temperature below 14⁰
                  Celsius, out of direct sunlight. Most packed items will have
                  expiry date mentioned on the pack (items' shelf life varies),
                  but generally they are as follows:
                  <ul>
                    <li>Bonbons, Praline & Truffles: 6 to 8 Weeks</li>
                    <li>Caramels: 12 Weeks</li>
                    <li>Centre Filled Bars: 6 Months</li>
                    <li>Florentine: 6 Months</li>
                    <li>Dragees: 12 Months</li>
                    <li>Palets: 6 Months</li>
                    <li>Mendiants: 6 Months</li>
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  What products do you offer that are vegan?
                </Accordion.Header>
                <Accordion.Body>
                  We offer a selection of vegan chocolate options. If you have
                  specific flavor preferences or dietary requirements, please
                  get in touch with us. We would be happy to help tailor
                  something to your needs.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  What products do you offer that are sugar-free?
                </Accordion.Header>
                <Accordion.Body>
                  Most of our chocolates are made with no added sugar. We also
                  have a range of our basic chocolates, which are sugar-free,
                  specially prepared on custom orders only.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  What products are gluten-free?
                </Accordion.Header>
                <Accordion.Body>
                  We have several gluten-free products. For more details, please
                  see our Allergens List.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </motion.div>

          {/* SHIPPING & DELIVERY */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-5"
          >
            <h2 className="faq-section-title montserrat-font">
              Shipping & Delivery Questions
            </h2>

            <Accordion className="montserrat-font">
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  Do you offer any same-day delivery services in Ahmedabad?
                </Accordion.Header>
                <Accordion.Body>
                  Yes! We do deliver our products same day through{" "}
                  <strong>Swiggy Genie</strong> and <strong>Porter</strong>.
                  Deliveries can be done from{" "}
                  <strong>10:00 AM to 11:30 AM</strong> and{" "}
                  <strong>3:30 PM to 8:00 PM</strong>.
                  <br />
                  <br />
                  If you have any queries, feel free to get in touch with us on{" "}
                  <a href="tel:+919727716480" className="faq-link">
                    +91 972 771 6480
                  </a>{" "}
                  or email us at{" "}
                  <a href="mailto:info@soulliqo.com" className="faq-link">
                    info@soulliqo.com
                  </a>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </motion.div>

          {/* CORPORATE ORDERS */}
          <motion.div
            variants={sectionVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-5"
          >
            <h2 className="faq-section-title montserrat-font">
              Corporate Orders, Customized Products & Wholesale
            </h2>

            <Accordion className="montserrat-font">
              <Accordion.Item eventKey="5">
                <Accordion.Header>
                  Who do I contact to make a corporate order?
                </Accordion.Header>
                <Accordion.Body>
                  <strong>Mrudang Jambusaria</strong>
                  <br />
                  <a href="mailto:info@soulliqo.com" className="faq-link">
                    info@soulliqo.com
                  </a>
                  {" | "}
                  <a href="mailto:mrudang@soulliqo.com" className="faq-link">
                    mrudang@soulliqo.com
                  </a>
                  <br />
                  <a href="tel:+919727716480" className="faq-link">
                    +91 972 771 6480
                  </a>
                  <br />
                  Email or WhatsApp will be the best mode of communication. If
                  you wish to connect over a call, I am just a buzz away.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="6">
                <Accordion.Header>
                  Do you offer bulk discounts?
                </Accordion.Header>
                <Accordion.Body>
                  Yes! We offer bulk discounts on orders of 150 boxes or more.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="7">
                <Accordion.Header>
                  Are you able to customize orders?
                </Accordion.Header>
                <Accordion.Body>
                  Yes! We offer a <b>wide range of customization</b> options at
                  various price points and lead times. For custom outer box
                  designs, the minimum order quantity is 150 boxes. If your
                  order is smaller than that, we recommend using our standard
                  boxes — and to make them feel special, we can{" "}
                  <b>customize the inner card</b> and add intricate design
                  elements to enhance the overall presentation.
                </Accordion.Body>
                <Accordion.Body>
                  You can also include external cards if you’d like to provide
                  your own personalized message or note inside the box. To
                  ensure timely inclusion, we require the card or content at
                  least 5 days before your scheduled delivery date.
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="8">
                <Accordion.Header>
                  Do you offer multiple shipping options?
                </Accordion.Header>
                <Accordion.Body>
                  Yes! We ship anywhere in India. Shipping charges vary
                  depending on the delivery city. To ensure your chocolates
                  arrive in perfect condition, we use either dry ice or ice
                  packs, based on the destination and transit time.
                </Accordion.Body>
                <Accordion.Body>
                  To<b> ship multiple orders</b>, you can submit a list of
                  recipient names, addresses, and contact numbers. For your
                  convenience, please download and use our reference sheet to
                  prepare the shipping labels
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="9">
                <Accordion.Header>
                  Do you do private label or wholesale?
                </Accordion.Header>
                <Accordion.Body>
                  Yes! We do private label and wholesale. If you are interested
                  in becoming our customer, then do connect with us at{" "}
                  <a href="mailto:info@soulliqo.com" className="faq-link">
                    info@soulliqo.com
                  </a>{" "}
                  or{" "}
                  <a href="tel:+919727716480" className="faq-link">
                    +91 972 771 6480
                  </a>
                  .
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </motion.div>
        </Container>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Faqs;
