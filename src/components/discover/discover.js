import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../../index.css";

const Discover = () => {
  const discoverItems = [
    {
      title: "Bestsellers",
      img: "/images/discover1.png",
      link: "#",
      img: "/images/default.png",
      link: "/bestsellers",
    },
    {
      title: "Gifting",
      img: "/images/discover2.png",
      link: "#",
    },
    {
      title: "Recommended",
      img: "/images/discover3.png",
      link: "#",
    },
    {
      title: "Bestsellers",
      img: "/images/discover1.png",
      link: "#",
    },
  ];
  return (
    <div>
      <Container fluid className="discover-section py-5">
        <h2 className="discover-title montserrat-font text-uppercase text-center mb-2 mb-lg-5">
          DISCOVER
        </h2>

        <Row className="align-items-center">
          {/* Left text (desktop view) */}
          <Col
            lg={4}
            md={12}
            className="mb-4 mb-lg-0 text-center text-lg-start"
          >
            <h5 className="discover-subtitle montserrat-font">Top Sellers</h5>
            <p className="discover-text figtree-font ">
              Crazy enough chocolate originates from a bean just like the coffee
              bean called Cacao. Cacao has been around for thousands of years
              and was first discovered by the Native American tribe called the
              Mayans.
            </p>
            <a href="#" className="discover-link figtree-font ">
              View more about Top Sellers →
            </a>
          </Col>

          {/* Swiper Carousel */}
          <Col lg={8} md={12}>
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              breakpoints={{
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
            >
              {discoverItems.map((item, index) => (
                <SwiperSlide key={index}>
                  <a href={item.link} className="discover-card">
                    <div className="image-box arch-image">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="img-fluid"
                      />
                      <span className="discover-btn figtree-font ">{item.title}</span>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Discover;
