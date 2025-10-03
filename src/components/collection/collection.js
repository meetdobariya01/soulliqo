import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Card } from "react-bootstrap";
import axios from "axios";
const Collection = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products/categories"); 
        setCollections(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);
  // split items into chunks of 4 for desktop view
  const chunkSize = 4;
  const slides = [];
  for (let i = 0; i < collections.length; i += chunkSize) {
    slides.push(collections.slice(i, i + chunkSize));
  }
  return (
    <div>
      <div className="my-5 container">
        <h2 className="font-collection mb-4">OUR COLLECTION</h2>
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