import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

const Mycarousel = () => {
  return (
    <div>
      <div className="carousel">
        <Carousel fade interval={2000}>
          {/* Slide 1 - Image */}
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-img"
              src="./images/carousel-1.png"
              alt="Chocolate Slide 1"
            />
            <div className="carousel-caption">
              <h2>New in Ahmedabad</h2>
              <p></p>
            </div>
          </Carousel.Item>

          {/* Slide 2 - Video */}
          <Carousel.Item>
            <video
              className="d-block w-100 carousel-video"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="./images/carousel-2.mp4" type="video/mp4" />
            </video>
            <div className="carousel-caption">
              <h2>Delicious Experience</h2>
              <p>Handcrafted Chocolates, Now Near You</p>
            </div>
          </Carousel.Item>

          {/* Slide 3 - Image */}
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-img"
              src="./images/carousel-3.jpg"
              alt="Chocolate Slide 2"
            />
            <div className="carousel-caption">
              <h2>Sweet Moments</h2>
              <p>Perfect Treats for Every Occasion</p>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default Mycarousel;
