import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // FIX: Using the correct mounted route: /products/categories
        const res = await axios.get("http://localhost:5000/products/categories");
        setCollections(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Split items into chunks of 4 for desktop view
  const chunkSize = 4;
  const slides = [];
  for (let i = 0; i < collections.length; i += chunkSize) {
    slides.push(collections.slice(i, i + chunkSize));
  }

  return (
    <div>
      <div className="my-5 container">
        <h2 className="font-collection mb-4">OUR COLLECTION</h2>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" />
            <p>Loading Collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center my-5">
            <p>No collections found. Check server endpoint and data.</p>
          </div>
        ) : (
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
                        // The item.img path is fixed in the backend router
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
        )}
      </div>
    </div>
  );
};
export default Collection;