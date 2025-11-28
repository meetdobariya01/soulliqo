import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import '../../index.css';

const products = [
  { id: 1, name: "Chocolate Bar", img: "/images/gallery/1.jpg" },
  { id: 2, name: "Dark Truffle", img: "/images/gallery/2.jpg" },
  { id: 3, name: "Hazelnut Bliss", img: "/images/gallery/3.jpg" },
  { id: 4, name: "Caramel Crisp", img: "/images/gallery/4.jpg" },
  { id: 5, name: "Mint Delight", img: "/images/gallery/5.jpg" },
  { id: 6, name: "Golden Mix", img: "/images/gallery/6.jpg" },
  { id: 7, name: "Berry Fusion", img: "/images/gallery/7.jpg" },
  { id: 8, name: "Coffee Crunch", img: "/images/gallery/8.jpg" },
  { id: 9, name: "White Velvet", img: "/images/gallery/9.jpg" },
  { id: 10, name: "Berry Fusion", img: "/images/gallery/10.jpg" },
  { id: 11, name: "Coffee Crunch", img: "/images/gallery/11.jpeg" },
  { id: 12, name: "White Velvet", img: "/images/gallery/12.jpeg" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  return (
    <div>
      {/* Header Component */}
      <Header />

      <div className="gallery-container">
        <motion.h1
          className="gallery-title"
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
