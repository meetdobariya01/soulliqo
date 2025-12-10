import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";


const API_BASE = "http://localhost:5000";

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/categories`);
        const data = Array.isArray(res.data) ? res.data : [];
        setCollections(data);
      } catch (err) {
        console.error("❌ Error fetching categories:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // ✅ Chunk into slides of 4
  const chunkSize = 4;
  const slides = [];
  for (let i = 0; i < collections.length; i += chunkSize) {
    slides.push(collections.slice(i, i + chunkSize));
  }

  // ✅ Custom image selector (PUBLIC FOLDER)
  const getCollectionImage = (title) => {
    switch (title.toUpperCase()) {
      case "BON BON":
        return "/images/bonbon/Collage Bon Bon.png";
      case "TRUFFLE":
        return "/images/bonbon/STYLED TRUFFLE.jpg";
      case "PRALINE":
        return "/images/bonbon/STYLED PRALINE.jpg";
      case "CENTERFILLED TABLET":
        return "/images/bonbon/Colage Bar.png";
      default:
        return "/images/bonbon/default.png";
      case "INDULGENCE TABLET":
        return "/images/bonbon/Florentine Collage.png";
      case "BOXBON BON":
        return "/images/bonbon/_MG_4598.jpg";
      case "BOXTRUFFLE":
        return "/images/bonbon/_MG_4598.jpg";
      case "BOXPRALINE":
        return "/images/bonbon/_MG_4598.jpg";
      case "DRAGEES":
        return "/images/bonbon/SOULLIQO - Session 12917-Edit-Edit-Edit.jpg";
    }
  };

  return (
    <div className="my-5 container">
      <h2 className="font-collection text-uppercase montserrat-font mb-4">Our Collection</h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading Collections...</p>
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center my-5">
          <p>No collections found.</p>
        </div>
      ) : (
        <Carousel indicators={false} interval={4000}>
          {slides.map((group, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex flex-wrap justify-content-center">
                {group.map((item) => (
                  <Card
                    key={item._id}
                    className="collection-card m-2 shadow-sm border-0"
                    style={{
                      cursor: "pointer",
                      width: "240px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "transform 0.3s ease"
                    }}
                    onClick={() =>
                      navigate(`/products/${encodeURIComponent(item.title)}`)
                    }
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <Card.Img
                      variant="top"
                      src={getCollectionImage(item.title)}
                      onError={(e) =>
                        (e.target.src = "/images/bonbon/default.png")
                      }
                      style={{
                        height: "180px",
                        objectFit: "contain",
                        padding: "15px",
                        background: "#f7f7f7"
                      }}
                    />

                    <Card.Footer className="text-center fw-bold bg-white border-0">
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
  );
};

export default Collection;
