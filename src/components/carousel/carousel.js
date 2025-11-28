import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

const Mycarousel = () => {
  return (
    <div>
      <div className="custom-carousel-container">
        <Carousel
          fade
          interval={2500}
          indicators={false}
          controls={false}
          pause={false}
        >
          {/* Slide 1 */}
          <Carousel.Item className="slide">
            <img
              className="d-block w-100 slide-img"
              src="./images/carousel-4.jpg"
              alt="Slide 1"
            />

            <div className="slide-caption">
              <h2 className="fade-text">New in Ahmedabad</h2>
            </div>
          </Carousel.Item>

          {/* Slide 2 */}
          <Carousel.Item className="slide">
            <video
              className="d-block w-100 slide-img"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="./images/carousel-2.mp4" type="video/mp4" />
            </video>

            <div className="slide-caption">
              <h2 className="fade-text">Delicious Experience</h2>
              <p className="fade-text-small">
                Handcrafted Chocolates, Now Near You
              </p>
            </div>
          </Carousel.Item>

          {/* Slide 3 */}
          <Carousel.Item className="slide">
            <img
              className="d-block w-100 slide-img"
              src="./images/hero.jpg"
              alt="Slide 3"
            />

            <div className="slide-caption">
              <h2 className="fade-text">Sweet Moments</h2>
              <p className="fade-text-small">
                Perfect Treats for Every Occasion
              </p>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default Mycarousel;
