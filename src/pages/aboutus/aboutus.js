import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../index.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const Aboutus = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* About Us Section */}
      <section className="about-us-section mt-5 container">
        <Container fluid>
          <Row className="align-items-center">
            {/* Left Side - Image */}
            <Col md={6} className=" position-relative">
              <img
                src="./images/aboutus.jpg"
                alt="Chocolate Chef"
                className="img-fluid h-100 w-100 object-cover"
              />
              <div className="floral-bg-left"></div>
            </Col>

            {/* Right Side - Content */}
            <Col md={6} className="">
              <div className="about-box shadow">
                <h2 className="about-title">About us</h2>
                <p className="about-text">
                  Welcome to SOULLIQO Chocolate Poetry, where crafting exquisite
                  chocolates is an art infused with unwavering dedication. Our
                  chocolates are meticulously handcrafted, using the finest
                  ingredients sourced from Europe, Africa and India. Callebaut
                  chocolate, our chosen cornerstone, reflects our dedication to
                  excellence.
                  <br />
                  <br />
                  Our roots are deeply entwined in every aspect of SOULLIQO’s
                  essence. From our skilled chocolatier chefs to our in-house
                  factory, the spirit of homegrown craftsmanship prevails. This
                  commitment resonates in each creation, ensuring our offerings
                  embody true quality and authenticity.
                  <br />
                  <br />
                  With captivating array of over 150 flavors, our chocolate
                  range underscores our restless passion for taste. Whether you
                  relish velvety caramels or nutty pralines, each chocolate is a
                  symphony of flavors, inviting you on a voyage that indulges
                  your senses.
                  <br />
                  <br />
                  Our meticulous craftsmanship and diverse flavors make SOULLIQO
                  in the realm of refined taste and indulgence. Step into
                  SOULLIQO Chocolate Poetry, where every piece tells its own
                  story.
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

export default Aboutus;
