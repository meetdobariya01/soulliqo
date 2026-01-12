import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../index.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Ourmission = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Our Mission Section */}
      <section className="values-section container py-5">
        <Container fluid className="p-0">
          <Row className="g-0 align-items-stretch">
            {/* Left Side - Image */}

            {/* Right Side - Content */}
            <Col md={6} className="d-flex align-items-center">
              <div className="values-box">
                <h2 className="mission-title montserrat-font text-uppercase">
                  Our Mission
                </h2>
                <p className="mission-quote figtree-font">
                  “We believe passionately that a gift of indulgence is one of
                  the best way to express appreciation.”
                </p>
                <p className="mission-text figtree-font ">
                  Our Mission is simple - to create the most delicious, bespoke
                  chocolate using only the finest ingredients sourced from
                  across the world, especially Europe, Africa & India to be
                  enjoyed by all.
                  <br />
                  <br />
                  We are passionate about the art of chocolate making and
                  continuously strive to create premium chocolate and moments of
                  delight that put smiles on our customer’s face…
                </p>
              </div>
            </Col>
            <Col md={6} className="values-img-col">
              <img
                src="./images/mission.webp" // change to your image path
                alt="Our Values"
                className="values-img"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Values Section */}
      <section className="values-section container py-5">
        <Container fluid className="p-0">
          <Row className="g-0 align-items-stretch">
            {/* Left Side - Image */}
            <Col md={6} className="values-img-col">
              <img
                src="./images/Vision.webp"
                alt="Our Values"
                className="values-img"
              />
            </Col>

            {/* Right Side - Content */}
            <Col md={6} className="d-flex align-items-center">
              <div className="values-box">
                <h2 className="values-title montserrat-font text-uppercase">
                  Our Values
                </h2>
                <p className="values-text figtree-font">
                  All our chocolates are hand crafted in India with more Cocoa &
                  Chocolate and negligible to no added sugar and 100% pure Cocoa
                  Butter, with finest quality ingredients from Europe, Africa
                  and India. Our Artisan Chocolatiers keep utmost care of
                  Aesthetic Appeal, Aromatic Intrigue, Textural Delight,
                  Seduction of Taste and above all Adventurous flavor pairing
                  inspired by Ingredients from around the Globe.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Ourmission;
