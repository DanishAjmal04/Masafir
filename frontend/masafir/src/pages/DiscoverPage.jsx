import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import discover1 from "../assets/discover-1.jpeg";
import discover2 from "../assets/discover-2.jpeg";
import discover3 from "../assets/discover-3.jpeg";
import discover4 from "../assets/discover-4.jpeg";

const SECTIONS = [
  {
    id: 1,
    image: discover1,
    imageFirst: true,
    tag: "Where It Began",
    title: "Every journey begins\nwith memory.",
    content: [
      "We grew up surrounded by the colors of South Asia the texture of handmade fabrics, the depth of cultural patterns, the pride woven into every thread. But we also lived in a fast-moving world where identity is constantly evolving.",
      "Masafir was born in that intersection between where we come from and where we are going.",
    ],
    bullets: [],
    footer: null,
  },
  {
    id: 2,
    image: discover2,
    imageFirst: false,
    tag: "What We Believe",
    title: "Heritage is not something\nto preserve in silence.",
    content: [
      "We believe heritage is not something to preserve in silence it is something to wear forward.",
      "Every piece is designed with intention:",
    ],
    bullets: [
      "Inspired by South Asian cultural elements",
      "Refined with modern silhouettes",
      "Crafted for everyday movement and expression",
    ],
    footer: "Slow fashion. Honest materials. Timeless identity.",
  },
  {
    id: 3,
    image: discover3,
    imageFirst: true,
    tag: "The Modern Journey",
    title: "Not bound to one place\nor one era.",
    content: [
      "Masafir is not bound to one place or one era. It belongs to those who:",
    ],
    bullets: [
      "Travel between cities and cultures",
      "Carry their roots with pride",
      "Express themselves without compromise",
    ],
    footer: "From tradition to street, from east to west Masafir moves with you.",
  },
  {
    id: 4,
    image: discover4,
    imageFirst: false,
    tag: "Our Mission",
    title: "We craft pieces\nof journey.",
    content: [
      "To redefine South Asian fashion for a global generation not as nostalgia, but as living identity.",
      "We don't just make clothing.",
    ],
    bullets: [],
    footer: null,
    bold: "We craft pieces of journey.",
  },
];

export default function DiscoverPage() {
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
    }}>

      {/* Hero */}
      <div style={{
        maxWidth: "1152px",
        margin: "0 auto",
        padding: isMobile ? "40px 20px 0" : "64px 48px 0",
        textAlign: "center",
      }}>
        <span style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#111111",
          fontWeight: 400,
        }}>
          ✦ Our Story ✦
        </span>

        <h1 style={{
          fontFamily: "'Figtree', serif",
          fontSize: isMobile ? "36px" : "clamp(36px, 5vw, 64px)",
          fontWeight: 300,
          color: "#0F0F0E",
          margin: "16px 0 20px",
          lineHeight: 1.15,
        }}>
          Clothing that travels<br />as far as you do.
        </h1>

        <p style={{
          fontSize: "13px",
          color: "#666",
          maxWidth: "420px",
          lineHeight: "1.9",
          margin: "0 auto 48px",
        }}>
          Masafir was born from a love of journeys the places we go,
          the people we meet, and the stories we carry back.
          Every piece is designed to move with you.
        </p>

        <div style={{ height: "1px", background: "#E5D5BC" }} />
      </div>

      {/* Alternating Sections */}
      <div style={{
        maxWidth: "1152px",
        margin: "0 auto",
        padding: isMobile ? "0 0" : "0 48px",
      }}>
        {SECTIONS.map((sec, i) => (
          <div key={sec.id}>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "0",
              minHeight: isMobile ? "auto" : "520px",
            }}>
              {/* Image — mobile pe hamesha upar */}
              <div style={{
                order: isMobile ? 1 : sec.imageFirst ? 1 : 2,
                overflow: "hidden",
                height: isMobile ? "280px" : "auto",
              }}>
                <img
                  src={sec.image}
                  alt={sec.tag}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Content — mobile pe hamesha neeche */}
              <div style={{
                order: isMobile ? 2 : sec.imageFirst ? 2 : 1,
                padding: isMobile ? "36px 20px" : "64px 56px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: i % 2 === 0 ? "#FDFBF7" : "#F9F5EE",
              }}>
                <span style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#111111",
                  marginBottom: "16px",
                  display: "block",
                }}>
                  {sec.tag}
                </span>

                <h2 style={{
                  fontFamily: "'Figtree', serif",
                  fontSize: isMobile ? "28px" : "clamp(24px, 2.8vw, 36px)",
                  fontWeight: 300,
                  color: "#0F0F0E",
                  margin: "0 0 20px",
                  lineHeight: 1.25,
                  whiteSpace: "pre-line",
                }}>
                  {sec.title}
                </h2>

                {sec.content.map((para, j) => (
                  <p key={j} style={{
                    fontSize: "13px",
                    color: "#3A3A36",
                    lineHeight: "1.9",
                    margin: "0 0 12px",
                  }}>
                    {para}
                  </p>
                ))}

                {sec.bullets.length > 0 && (
                  <ul style={{
                    margin: "8px 0 16px",
                    paddingLeft: "0",
                    listStyle: "none",
                  }}>
                    {sec.bullets.map((b, j) => (
                      <li key={j} style={{
                        fontSize: "13px",
                        color: "#3A3A36",
                        lineHeight: "1.9",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "4px",
                      }}>
                        <span style={{ color: "#9E7D52", marginTop: "2px" }}>•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.footer && (
                  <p style={{
                    fontSize: "13px",
                    color: "#0F0F0E",
                    lineHeight: "1.9",
                    fontStyle: "italic",
                    marginTop: "8px",
                  }}>
                    {sec.footer}
                  </p>
                )}

                {sec.bold && (
                  <p style={{
                    fontSize: "13px",
                    color: "#0F0F0E",
                    fontWeight: 500,
                    marginTop: "4px",
                  }}>
                    {sec.bold}
                  </p>
                )}
              </div>
            </div>

            {i < SECTIONS.length - 1 && (
              <div style={{ height: "1px", background: "#E5D5BC" }} />
            )}
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div style={{
        background: "#0F0F0E",
        padding: isMobile ? "48px 24px" : "64px 48px",
        textAlign: "center",
        marginTop: isMobile ? "0" : "0",
      }}>
        <span style={{
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#ffffff",
          display: "block",
          marginBottom: "16px",
        }}>
          ✦ Heritage in Every Thread ✦
        </span>

        <p style={{
          fontFamily: "'Figtree', serif",
          fontSize: isMobile ? "22px" : "clamp(18px, 2.5vw, 28px)",
          fontWeight: 300,
          color: "#FDFBF7",
          margin: "0 0 36px",
          lineHeight: 1.5,
        }}>
          Where South Asian roots meet modern identity.
        </p>

        <Link
          to="/shop"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "#FDFBF7",
            color: "#0F0F0E",
            padding: "14px 36px",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
            borderRadius: "10px",
          }}
        >
          Browse Collection
          <ArrowRight size={13} />
        </Link>
      </div>

    </div>
  );
}