import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../index.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Ourvalues = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Our Values Section */}
      <section className="values-section container py-5"> 
        <Container fluid className="p-0">
          <Row className="g-0 align-items-stretch">
            {/* Left Side - Image */}
            <Col md={6} className="values-img-col">
              <img
                src="./images/value.png" // change to your image path
                alt="Our Values"
                className="values-img"
              />
            </Col>

            {/* Right Side - Content */}
            <Col md={6} className="d-flex align-items-center">
              <div className="values-box">
                <h2 className="values-title">Our Values</h2>
                <p className="values-text">
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Ourvalues;
