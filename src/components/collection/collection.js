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
    const fetchCollections = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products/categories");
        setCollections(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Error fetching categories:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Split into slides of 4
  const chunkSize = 4;
  const slides = [];
  for (let i = 0; i < collections.length; i += chunkSize) {
    slides.push(collections.slice(i, i + chunkSize));
  }

  // ✅ Safe helper to get image URL
  const getImageUrl = (img) => {
    const API_BASE = "http://localhost:5000";

    // If image field is undefined, null, or empty
    if (!img) return "https://via.placeholder.com/240x180?text=No+Image";

    // If it's an array, take the first valid item
    if (Array.isArray(img)) {
      const validImg = img.find((i) => typeof i === "string" && i.trim() !== "");
      if (!validImg)
        return "https://via.placeholder.com/240x180?text=No+Image";
      img = validImg;
    }

    // Make sure img is a string
    if (typeof img !== "string" || img.trim() === "")
      return "https://via.placeholder.com/240x180?text=No+Image";

    // Remove extra commas
    if (img.includes(",")) img = img.split(",")[0].trim();

    // Handle missing slashes or relative URLs
    if (img.startsWith("http")) return img;
    if (!img.startsWith("/")) img = "/" + img;

    return `${API_BASE}${img}`;
  };

  return (
    <div className="my-5 container">
      <h2 className="font-collection mb-4 text-uppercase">OUR COLLECTION</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <p>Loading Collections...</p>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center my-5">
          <p>No collections found. Check backend route `/products/categories`.</p>
        </div>
      ) : (
        <Carousel indicators={false} interval={4000}>
          {slides.map((group, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex flex-wrap justify-content-center">
                {group.map((item) => (
                  <Card
                    key={item._id || item.id}
                    className="collection-card m-2 shadow-sm border-0"
                    style={{ cursor: "pointer", width: "240px" }}
                    onClick={() => navigate(`/products/${item.title || item.name}`)}
                  >
                    <Card.Img
                      variant="top"
                      src={getImageUrl(item.img || item.image)}
                      className="collection-img"
                      style={{
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "12px 12px 0 0",
                      }}
                    />
                    <Card.Footer className="text-center fw-bold bg-white border-0">
                      {item.title || item.name}
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default Collection;
