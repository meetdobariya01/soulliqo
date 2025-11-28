import React from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import "../../index.css";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Quality",
    text: "Bespoke Chocolates with importance to handmade craftsmanship with perfect chocolate and strict operational measures. We use finest, fresh and best quality ingredients sourced from across the globe.",
    img: "./images/Brandethos3.png", // replace with real image
    bg: "#fef9e7",
    reverse: false,
  },
  {
    title: "Coverture",
    text: "Passionate about art of chocolate making. Higher % of cocoa butter in all our products. Our chocolates has more sheen a firmer snap when broken and above all creamy with enhanced explosion of flavor.",
    img: "./images/Brandethos3.png",
    bg: "#f5ebe7",
    reverse: true,
  },
  {
    title: "Dietary Inclusions",
    text: "Cater to all dietary needs and our goal is for everyone to be able to enjoy and relish our chocolates. It can be made vegan, dairy free, gluten free and nut free without sacrificing on quality and taste.",
    img: "./images/Brandethos3.png",
    bg: "#ffffff",
    reverse: false,
  },
  {
    title: "Innovation",
    text: "Mighty innovative spirit driving us to continue developing new, interesting and bold chocolate flavors. Value experiences we create with our chocolates and creative process of taking an idea and making it to reality for our valued guests.",
    img: "./images/Brandethos4.png",
    bg: "#e6b8af",
    reverse: true,
  },
  {
    title: "Sustainability",
    text: "Values doing good in world and ethical practices. We make conscious efforts to minimize usage of plastics in packaging as well as operations.",
    img: "./images/Brandethos5.png",
    bg: "#fef9e7",
    reverse: false,
  },
  {
    title: "Hand Crafted Artisan Chocolates",
    text: "We believe in breaking the mold and changing the game, and the passion is the secret ingredient. We believe that nature is naturally extraordinary, and that handmade is the only way ahead.",
    img: "./images/Brandethos6.png",
    bg: "#e6b8af",
    reverse: true,
  },
  {
    title: "Guest Oriented",
    text: "Customization to your individual needs and designed with your special moment in mind. We create unique experiences and memories to treasure, and this is our reason for being.",
    img: "./images/Brandethos7.png",
    bg: "#f5ebe7",
    reverse: false,
  },
];

const AnimatedSection = ({ title, text, img, bg, reverse }) => (
    
  <div
    className={`row d-flex align-items-center my-3 ${
      reverse ? "flex-row-reverse" : ""
    }`}
    style={{ background: bg }}
  >
    {/* IMAGE - 25% */}
    <div className="col-md-3 p-0">
      <motion.img
        src={img}
        alt={title}
        className="img-fluid  h-20"
        style={{ objectFit: "cover" }}
        initial={{ opacity: 0, x: reverse ? 100 : -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      />
    </div>

    {/* TEXT - 75% */}
    <div className="col-md-9 p-3">
      <motion.div
        initial={{ opacity: 0, x: reverse ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h3 className="fw-bold mb-3 title">{title}</h3>
        <p className="text">{text}</p>
      </motion.div>
    </div>
  </div>
);

const Brandethos = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Brand Ethos Section */}

      <h2 className="ethos-heading mt-3">Brand Ethos</h2>
      <div className="container-fluid">
        {sections.map((section, idx) => (
          <AnimatedSection key={idx} {...section} />
        ))}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Brandethos;
