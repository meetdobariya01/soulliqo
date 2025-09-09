import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Card } from "react-bootstrap";

const collections = [
  {
    id: 1,
    title: "Bon Bon",
    img: "./images/our-collection1.jpg",
    link: "/collection/bonbon",
  },
  {
    id: 2,
    title: "Chocolate Block",
    img: "./images/our-collection2.jpg",
    link: "/collection/chocolate-block",
  },
  {
    id: 3,
    title: "Melt In Mouth",
    img: "./images/our-collection3.jpg",
    link: "/collection/melt",
  },
  {
    id: 4,
    title: "Dragees Collection",
    img: "./images/our-collection4.jpg",
    link: "/collection/dragees",
  },
];
const Collection = () => {
  const navigate = useNavigate();

  // split items into chunks of 4 for desktop view
  const chunkSize = 4;
  const slides = [];
  for (let i = 0; i < collections.length; i += chunkSize) {
    slides.push(collections.slice(i, i + chunkSize));
  }

  return (
    <div>
      <div className="my-5 container">
        <h2 className="font-collection  mb-4">OUR COLLECTION</h2>

        <Carousel indicators={false} interval={4000}>
          {slides.map((group, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex flex-wrap justify-content-center">
                {group.map((item) => (
                  <Card
                    key={item.id}
                    className="collection-card m-2"
                    onClick={() => navigate(item.link)}
                  >
                    <Card.Img
                      variant="top"
                      src={item.img}
                      className="collection-img"
                    />
                    <Card.Footer className="text-center fw-bold bg-white">
                      {item.title}
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Collection;
