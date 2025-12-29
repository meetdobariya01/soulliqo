import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { FaFilePdf, FaDownload } from "react-icons/fa";
import "../../index.css";

const products = [
  { id: 1, name: "Chocolate Bar", img: "/images/bonbon/E-com/_MG_4549.jpg" },
  { id: 2, name: "Dark Truffle", img: "/images/bonbon/E-com/_MG_4530.jpg" },
  { id: 3, name: "Hazelnut Bliss", img: "/images/bonbon/E-com/_MG_4549.jpg" },
  { id: 4, name: "Caramel Crisp", img: "/images/bonbon/E-com/CREATIVE12.jpg" },
  { id: 5, name: "Mint Delight", img: "/images/bonbon/E-com/CREATIVE16.jpg" },
  { id: 6, name: "Golden Mix", img: "/images/bonbon/E-com/CREATIVE21.jpg" },
  { id: 7, name: "Berry Fusion", img: "/images/bonbon/E-com/_MG_4808.jpg" },
  {
    id: 8,
    name: "Coffee Crunch",
    img: "/images/bonbon/E-com/STYLED_PRALINE.jpg",
  },
  { id: 9, name: "White Velvet", img: "/images/bonbon/E-com/BB7CLS.jpg" },
  { id: 10, name: "Berry Fusion", img: "/images/bonbon/E-com/BB12FP.jpg" },
  { id: 11, name: "Coffee Crunch", img: "/images/bonbon/E-com/BB12NN.jpg" },
  { id: 12, name: "White Velvet", img: "/images/bonbon/E-com/BB12SUN.jpg" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = "/images/bon-bon-pdf.pdf"; // put pdf inside public folder
    link.download = "Bon-Bon.pdf";
    link.click();
  };
  return (
    <div>
      {/* Header Component */}
      <Header />

      <div className="gallery-container">
        <button
          onClick={downloadPdf}
          style={{
            display: "flex",
            margin: "20px auto",
            alignItems: "center",
            gap: "10px",
            padding: "14px 26px",
            borderRadius: "14px",
            background: "#312625",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 10px 30px rgba(255,77,77,0.4)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 14px 40px rgba(255,77,77,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,77,77,0.4)";
          }}
        >
          <FaFilePdf size={20} />
          Our Catalogue
          <FaDownload />
        </button>

        <motion.h1
          className="gallery-title montserrat-font text-uppercase"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Our Chocolate Collection
        </motion.h1>

        <div className="gallery-grid">
          {products.map((p, index) => (
            <motion.div
              className="gallery-card"
              key={p.id}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: index * 0.1 }}
            >
              <motion.img
                src={p.img}
                alt={p.name}
                whileHover={{ scale: 1.05 }}
                className="gallery-image"
                onClick={() => setSelectedImg(p.img)}
              />
              {/* <h3 className="product-name">{p.name}</h3> */}
            </motion.div>
          ))}
        </div>
      </div>

      {/* IMAGE MODAL */}
      {selectedImg && (
        <motion.div
          className="modal-overlay"
          onClick={() => setSelectedImg(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.img
            src={selectedImg}
            alt="Selected Chocolate"
            className="modal-image"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          />
        </motion.div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Gallery;
