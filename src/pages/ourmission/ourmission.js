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
      <section className="our-mission-section py-5">
        <Container>
          <Row className="align-items-center">
            {/* Left side image */}
            <Col md={6} className="mb-4 mb-md-0">
              <img
                src="./images/mission.png"
                alt="Our Mission"
                className="img-fluid rounded shadow"
              />
            </Col>

            {/* Right side content */}
            <Col md={6} className="position-relative">
              <div className="floral-bg-right"></div>
              <h2 className="mission-title">Our Mission</h2>
              <p className="mission-quote">
                “We believe passionately that a gift of indulgence is one of the
                best way to express appreciation.”
              </p>
              <p className="mission-text">
                Our Mission is simple — to create the most delicious, bespoke
                chocolate using only the finest ingredients sourced from across
                the world, especially Europe, Africa & India to be enjoyed by
                all.
                <br />
                <br />
                We are passionate about the art of chocolate making and
                continuously strive to create premium chocolate and moments of
                delight that put smiles on our customer’s face…
              </p>
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
