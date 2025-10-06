import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../../index.css";
import Header from "../../components/header/header";
import Collection from "../../components/collection/collection";
import Discover from "../../components/discover/discover";
import Custmerlove from "../../components/custmerlove/custmerlove";
import Footer from "../../components/footer/footer";
const Homepage = () => {
  return (
    <div>
      {/* Header */}
      <Header />
      {/* Desktop View Section */}
      <div className="d-none d-md-block choco-banner">
        <Container>
          <Row className="align-items-center">
            {/* <Col md={12} className="text-center choco-text">
                <h2 className="title">Slice of Heaven</h2>
                <h3 className="brand">
                  <span className="highlight">SOULLIQO</span>{" "}
                  <span className="script">chocolate poetry</span>
                </h3>
              </Col> */}
          </Row>
        </Container>
      </div>
      {/* Mobile View Section */}
      <div className="d-block d-md-none choco-location text-center">
        <Container fluid className="p-0">
          <Row className="m-0">
            <Col className="p-0">
              <div className="choco-mobile-box">
                <h3 className="loc-title">New in Ahmedabad</h3>
                <p className="loc-sub">
                  Aarohi Galleria, South Bhopal, Ahmedabad
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="choco-text-section d-none d-md-block">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={8} className="text-center">
              <h2 className="choco-title slice-of-heaven">Slice of Heaven</h2>
              <h3 className="choco-brand">
                <span className="highlight">SOULLIQO</span>{" "}
                <span className="script the-nautigal-bold">
                  chocolate poetry
                </span>
              </h3>
            </Col>
            <Col md={4} className="flower-col">
              <div className="flower-img"></div>
            </Col>
          </Row>
        </Container>
      </div>
      {/* collection component */}
      <Collection />
      {/* Video Section */}
      <section className="our-story py-5">
        <div className="container text-center">
          <h2 className="mb-4 story-font">Our Story</h2>
          <p className="lead mx-auto mb-4 story-text story-font">
            We are farmers, fermenters, chocolate makers, chocolatiers and
            storytellers from India, in search of a distinct identity for
            chocolate that we can proudly call our own. In our pursuit, we are
            expressing the true flavours of Indian Cacao in endless
            interpretations of chocolate, like never before.
          </p>
          <div className="video-container">
            <video
              className="story-video"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
            >
              <source src="./images/our-story.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
      {/* Discover Component */}
      <Discover />
      {/* Make your own Box */}
      <Container fluid className="makebox-section py-5 container">
        <Row className="align-items-center">
          {/* Left Content */}
          <Col
            lg={6}
            md={12}
            className="text-center text-lg-start mb-4 mb-lg-0"
          >
            <div className="flower-bg">
              <h2 className="makebox-title text-center text-lg-end mb-4 mb-lg-0">
                Make your own <br /> Box
              </h2>
              <p className="makebox-text text-center text-lg-end mb-4 mb-lg-0">
                Make the gift of Soulliqo that little bit sweeter by adding a
                free personalized message.
              </p>
              <div className="d-flex justify-content-lg-end justify-content-center mt-3">
                <Button
                  as={NavLink}
                  to="/ownbox"
                  style={{
                    backgroundColor: "#7B5B54",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "10px 20px",
                    border: "none",
                    textDecoration: "none",
                    fontFamily: "Tenor Sans",
                  }}
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </Col>
          {/* Right Image */}
          <Col lg={6} md={12} className="text-center">
            <img
              src="./images/chocolate-box.png"
              alt="Make your own Box"
              className="img-fluid makebox-image h-25"
            />
          </Col>
        </Row>
      </Container>
      {/* Customer Love Component */}
      <Custmerlove />

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default Homepage;
