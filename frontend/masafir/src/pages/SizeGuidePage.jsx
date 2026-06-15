import { useState, useEffect } from "react";
import sizechart from "../assets/sizechart.jpeg";

export default function SizeGuidePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FDFBF7",
      fontFamily: "'Figtree', sans-serif",
      paddingTop: "97px",
      paddingBottom: "80px",
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: isMobile ? "32px 16px 0" : "48px 24px 0",
      }}>

        <span style={{
          display: "block",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#111111",
          fontWeight: 400,
          marginBottom: "12px",
        }}>
          Masafir
        </span>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? "32px" : "40px",
          fontWeight: 300,
          color: "#0F0F0E",
          margin: "0 0 24px",
        }}>
          Size Guide
        </h1>

        <div style={{
          height: "1px",
          background: "#0F0F0E",  // ← golden se black
          marginBottom: isMobile ? "28px" : "48px",
        }} />

        <img
          src={sizechart}
          alt="Masafir Size Guide"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: isMobile ? "8px" : "12px",
          }}
        />

      </div>
    </div>
  );
}