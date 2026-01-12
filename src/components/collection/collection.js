import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://api.soulliqo.com";

const Collection = () => {
  const [productCategories, setProductCategories] = useState([]);
  const [boxCollections, setBoxCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const [productRes, boxRes] = await Promise.all([
          axios.get(`${API_BASE}/products/categories`),
          axios.get(`${API_BASE}/api/categories`)
        ]);

        setProductCategories(Array.isArray(productRes.data) ? productRes.data : []);
        setBoxCollections(Array.isArray(boxRes.data) ? boxRes.data : []);
      } catch (err) {
        console.error("❌ Error fetching collections:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // ✅ Combine both collections
  const combinedCollections = [
    ...productCategories.map(c => ({ ...c, type: "product" })),
    ...boxCollections.map(b => ({ ...b, type: "box" }))
  ];

  // ✅ Chunk into slides
  const chunkSize = 3;
  const slides = [];
  for (let i = 0; i < combinedCollections.length; i += chunkSize) {
    slides.push(combinedCollections.slice(i, i + chunkSize));
  }

  // ✅ Custom image selector
  const getCollectionImage = (item) => {
    if (item.type === "box") {
      return item.image ? `${item.image}` : "/images/own-box.jpg";
    }
    switch (item.title.toUpperCase()) {
      case "BONBON":
        return "/images/bonbon/soulliqo/BonBonCoverPic.webp";
      case "TRUFFLE":
        return "/images/bonbon/E-com/STYLEDTRUFFLE.webp";
      case "PRALINE":
        return "/images/bonbon/E-com/STYLED_PRALINE.webp";
      case "CENTERFILLED TABLET":
        return "/images/bonbon/soulliqo/Colage-Bar.webp";
      case "MELT IN MOUTH":
        return "/images/bonbon/soulliqo/melt-in-mouth-3.webp";
      default:
        return "/images/bonbon/soulliqo/Zesty-Lime & Orange.webp";
    }
  };

  return (
    <div className="my-5 container">
      <h2 className="font-collection text-uppercase montserrat-font mb-4">
        Our Collection
      </h2>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p>Loading Collections...</p>
        </div>
      ) : combinedCollections.length === 0 ? (
        <div className="text-center my-5">
          <p>No collections found.</p>
        </div>
      ) : (
        <Carousel indicators={false} interval={4000}>
          {slides.map((group, slideIndex) => (
            <Carousel.Item key={`slide-${slideIndex}`}>
              <div className="d-flex flex-wrap justify-content-center">
                {group.map((item, itemIndex) => (
                  <Card
                    key={item._id || `${item.title}-${itemIndex}`}
                    className="collection-card m-2 shadow-sm border-0"
                    style={{
                      cursor: "pointer",
                      width: "240px",
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={() => {
                      if (item.type === "box") {
                        navigate(`/ownbox/${item._id}`);
                      } else {
                        navigate(`/products/${encodeURIComponent(item.title)}`);
                      }
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <Card.Img
                      variant="top"
                      src={getCollectionImage(item)}
                      onError={(e) => (e.target.src = "/images/bonbon/default.png")}
                      style={{
                        height: "170px",
                        objectFit: "contain",
                        background: "#f7f7f7",
                      }}
                    />
                    <Card.Footer className="text-center fw-bold bg-white border-0">
                      {item.title || item.name || item.COLLECTION}
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
