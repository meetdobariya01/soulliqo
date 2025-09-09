import React from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Custmerlove = () => {
      const reviews = [
    {
      name: "Ahmed Saimoon",
      image: "/images/review.jpg", // profile image
      stars: 4,
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
      product: "./images/custmer-love.png", // product image
    },
    {
      name: "Ahmed Saimoon",
      image: "/images/review.jpg",
      stars: 5,
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
      product: "./images/custmer-love.png",
    },
    {
      name: "Ahmed Saimoon",
      image: "/images/review.jpg",
      stars: 4,
      text: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
      product: "./images/custmer-love.png",
    },
  ];
  return (
    <div>
        <Container fluid className="customerlove-section py-5 container">
      <h2 className="text-center customerlove-title mb-5">Customer Love</h2>

      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={20}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="review-card">
              <img
                src={review.product}
                alt="Product"
                className="review-product"
              />
              <div className="review-body">
                <div className="review-user d-flex align-items-center mb-2">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="review-avatar"
                  />
                  <div>
                    <h6 className="mb-0">{review.name}</h6>
                    <div className="stars">
                      {"★".repeat(review.stars)}
                      {"☆".repeat(5 - review.stars)}
                    </div>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
    </div>
  )
}

export default Custmerlove; 
