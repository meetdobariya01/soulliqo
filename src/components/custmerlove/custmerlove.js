import React from "react";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
const Custmerlove = () => {
      const reviews = [
    {
      name: "Ananya Desai",
      image: "/images/review-1.jpg", // profile image
      stars: 4,
      text: "Every bite feels like a luxury dessert. Smooth, bold, and perfectly balanced.I ordered once, and now it’s a weekly ritual.",
      product: "./images/custmer-love.png", // product image
    },
    {
      name: "Rohit Mehra",
      image: "/images/review-2.jpg",
      stars: 5,
      text: "The caramel crunch is addictive. My kids keep fighting for the last piece! Delivery was super fast and the packaging felt soooo premium.",
      product: "./images/custmer-love-2.jpg",
    },
    {
      name: "Diya Shah",
      image: "/images/review-3.jpg",
      stars: 4,
      text: "The hazelnuts are fresh, the chocolate is silky, and the aroma is unforgettable.Opens like a luxury gift—tastes even better.",
      product: "./images/custmer-love-3.jpg",
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