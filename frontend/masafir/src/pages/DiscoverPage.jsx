import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FDFBF7",
      fontFamily: "'Jost', sans-serif",
      paddingTop: "97px",
    }}>

      {/* Hero Section */}
      <div style={{
        maxWidth: "1152px",
        margin: "0 auto",
        padding: "64px 48px 0",
      }}>
        <span style={{
          display: "block",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#9E7D52",
          fontWeight: 400,
          marginBottom: "16px",
        }}>
          Masafir
        </span>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 300,
          color: "#0F0F0E",
          margin: "0 0 24px",
          lineHeight: 1.1,
        }}>
          Discover
        </h1>

        <p style={{
          fontSize: "14px",
          color: "#666",
          maxWidth: "480px",
          lineHeight: "1.9",
          marginBottom: "64px",
        }}>
          Stories, inspirations, and the world behind Masafir — 
          where every piece carries a journey.
        </p>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: "#E5D5BC",
          marginBottom: "64px",
        }} />
      </div>

      {/* Stories Grid — baad mein yahan content aayega */}
      <div style={{
        maxWidth: "1152px",
        margin: "0 auto",
        padding: "0 48px 96px",
      }}>

        {/* Placeholder cards — apni stories se replace karna */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "40px",
        }}>
          {STORIES.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* Agar abhi koi story nahi */}
        {STORIES.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "80px 0",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 300,
              color: "#C4B8A8",
              marginBottom: "24px",
            }}>
              Stories coming soon
            </p>
            <Link
              to="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#0F0F0E",
                textDecoration: "none",
                borderBottom: "1px solid #0F0F0E",
                paddingBottom: "2px",
              }}
            >
              Browse Collection
              <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Story Card Component
function StoryCard({ story }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        transition: "transform 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div style={{
        width: "100%",
        aspectRatio: "4/5",
        background: "#F0E8DC",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "20px",
      }}>
        {story.image && (
          <img
            src={story.image}
            alt={story.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        )}
      </div>

      {/* Meta */}
      <span style={{
        fontSize: "10px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "#9E7D52",
      }}>
        {story.category}
      </span>

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "22px",
        fontWeight: 300,
        color: "#0F0F0E",
        margin: "8px 0 10px",
        lineHeight: 1.3,
      }}>
        {story.title}
      </h3>

      <p style={{
        fontSize: "12px",
        color: "#666",
        lineHeight: "1.8",
        marginBottom: "16px",
      }}>
        {story.excerpt}
      </p>

      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "11px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#0F0F0E",
        borderBottom: "1px solid #E5D5BC",
        paddingBottom: "2px",
      }}>
        Read More
        <ArrowRight size={11} />
      </span>
    </div>
  );
}

// Yahan apni stories add karo
const STORIES = [
  // Example:
  // {
  //   id: 1,
  //   category: "Heritage",
  //   title: "The Art of Pakistani Craft",
  //   excerpt: "A journey through the hands that weave our fabric.",
  //   image: "/images/story-1.jpg",
  // },
];