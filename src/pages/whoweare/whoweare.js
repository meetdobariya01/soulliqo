import React from "react";
import Header from "../../components/header/header";
import { Container, Row, Col } from "react-bootstrap";
import "../../index.css";
import Footer from "../../components/footer/footer";
const Whoweare = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />
      <section className="who-section py-5">
        <Container>
          <Row className="align-items-center">
            {/* Image First on Mobile, Second on Desktop */}
            <Col
              xs={12}
              md={6}
              className="order-1 order-md-2 text-center animate_animated animate_fadeInRight"
            >
              <img
                src="./images/brandjourney.png" // ✅ Put image inside public/images/
                alt="Chocolate Chef"
                className="img-fluid rounded who-image"
              />
            </Col>
            {/* Content */}
            <Col
              xs={12}
              md={6}
              className="order-2 order-md-1 animate_animated animate_fadeInLeft"
            >
              <h2 className="who-title">Who we are</h2>
              <p className="who-subtitle">Chocolate is like poetry,</p>
              <p className="who-text">
                From the elegant rhythm of its making to the enchanting duet of
                sharing it with loved ones. The essence of chocolate is a living
                verse in every bite... Immersed in a world of art and music, our
                chocolates are a reflection of our inspiration.
              </p>
              <p className="who-text">
                Crafted with traditional European techniques and equipment, they
                embody the essence of our creative journey... From the first
                cacao tree... Since the Aztecs used it as currency... From
                'xocolatl' to improvised Aztec's brew... To the recent
                'chocolates' of England and the Dutch mixes... To the first
                solid chocolate mixing of cocoa powder with cocoa butter and
                sugar and milk in 1847...
              </p>
              <p className="who-text">
                Uncovering a modern day legend, SOULLIQO. Born out of sheer hard
                work of various experts over the years.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Footer Section */}
      <Footer/>
    </div>  
  );
};
export default Whoweare;