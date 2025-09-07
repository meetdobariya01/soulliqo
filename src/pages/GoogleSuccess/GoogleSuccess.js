// src/pages/GoogleSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userId = params.get("userId");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      navigate("/afterlogin"); // your dashboard route
    } else {
      navigate("/login"); // fallback
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default GoogleSuccess;
