import React from "react";
import Navigation from "../../components/navigation/navigation";
import Header from "../../components/header/header";

const Afterlogin = () => {
  return (
    <div>
      {/* Header Section */}
      <Header />

      <div className="container mt-5">  
        {/* Navigation Bar */}
        <Navigation />
      </div>
    </div>
  );
};

export default Afterlogin;
