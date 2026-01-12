import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../../index.css";

import Header from "../../components/header/header";
import Collection from "../../components/collection/collection";
import Discover from "../../components/discover/discover";
import Custmerlove from "../../components/custmerlove/custmerlove";
import Footer from "../../components/footer/footer";
import Mycarousel from "../../components/carousel/carousel";

const Homepage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("https://api.soulliqo.com/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching collections:", err);
        setLoading(false);
      });
  }, []);

  const firstCollectionId = collections.length ? collections[0]._id : null;

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Carousel Section */}
      <Mycarousel />

      {/* Collection Component */}
      <Collection />

      {/* Our Story Section */}
      <section className="our-story">
        <div className="container text-center">
          <h2 className="mb-4 montserrat-font text-uppercase">Our Story</h2>
          <p className="mx-auto mb-4 story-text figtree-font">
            What started as a simple love for rich cocoa and timeless flavors
            soon turned into a journey of creating chocolates that speak to the
            soul. We believed chocolate should be more than just a treat; it
            should be an experience - one that melts slowly, lingers gently, and
            leaves behind a memory worth savoring.
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
              <source src="/images/our-story.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Discover Component */}
      <Discover />

      {/* Make Your Own Box Section */}
      <Container fluid className="makebox-section py-5 container">
        <Row className="align-items-center">
          {/* Left Content */}
          <Col
            lg={6}
            md={12}
            className="text-center text-lg-start mb-4 mb-lg-0"
          >
            <div className="flower-bg">
              <h2 className="makebox-title montserrat-font text-uppercase text-center text-lg-end mb-4 mb-lg-0">
                Make your own Box
              </h2>

              <p className="makebox-text figtree-font text-center text-lg-end mb-4 mb-lg-0">
                Make the gift of Soulliqo that little bit sweeter by adding a
                free personalized message.
              </p>

              <div className="d-flex justify-content-lg-end justify-content-center mt-3">
                {firstCollectionId ? (
                  <Button
                    as={NavLink}
                    to={`/ownbox/${firstCollectionId}`}
                    style={{
                      backgroundColor: "#7B5B54",
                      color: "#f0dfc9",
                      fontSize: "16px",
                      padding: "10px 20px",
                      border: "none",
                      textDecoration: "none",
                      fontFamily: "Figtree, sans-serif",
                    }}
                  >
                    Shop Now
                  </Button>
                ) : (
                  <Button disabled>Loading...</Button>
                )}
              </div>
            </div>
          </Col>

          {/* Right Image */}
          <Col lg={6} md={12} className="text-center">
            <img
              src="/images/own-box.jpg"
              alt="Make your own Box"
              className="img-fluid makebox-image"
            />
          </Col>
        </Row>
      </Container>

      {/* Customer Love */}
      <Custmerlove />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
