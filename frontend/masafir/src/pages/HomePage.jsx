import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useFeaturedProducts } from "../hooks/useProduct";
import { addToCart } from "../store/cartSlice.js";
import heroVideo from "../assets/mubeen.mp4";

const marqueeItems = [
  "New Arrivals",
  "Luxury Fabrics",
  "Slow Fashion",
  "Crafted in Pakistan",
  "Free Shipping Over PKR 5,000",
];

const styles = {
  page: {
    background:
      "radial-gradient(circle at top, #fffdf8 0%, #faf9f6 42%, #f7f4ef 100%)",
    color: "#1a1a1a",
    overflowX: "hidden",
  },

  container: {
    width: "min(1180px, 94vw)",
    margin: "0 auto",
  },

  sectionPad: {
    padding: "clamp(56px, 8vw, 110px) 0",
  },

  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: "clamp(28px, 5vw, 56px)",
    flexWrap: "wrap",
  },

  sectionLabel: {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#8a7a62",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: "clamp(28px, 5vw, 44px)",
    lineHeight: 1.1,
    fontWeight: 300,
    margin: 0,
  },

  viewAll: {
    textDecoration: "none",
    color: "#1a1a1a",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    paddingBottom: 4,
    borderBottom: "1px solid #d5c8b6",
  },

  ctaPrimary: {
    backgroundColor: "#f8f4ec",
    color: "#1a1a1a",
    border: "1px solid rgba(255,255,255,0.55)",
    backdropFilter: "blur(3px)",
    padding: "12px 30px",
    fontSize: 11,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    textDecoration: "none",
    transition: "all .25s ease",
    borderRadius: 10,
  },

  ctaGhost: {
    border: "1px solid #faf9f6",
    color: "#faf9f6",
    padding: "12px 30px",
    fontSize: 11,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    textDecoration: "none",
    transition: "all .25s ease",
    borderRadius: 10,
    display: "inline-block",
  },
};

export default function HomePage() {
  const [quickAddId, setQuickAddId] = useState(null);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 768);

  const dispatch = useDispatch();
  const featured = useFeaturedProducts();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleQuickAdd = (item) => {
    dispatch(
      addToCart({
        id:       item.id,
        name:     item.name,
        price:    typeof item.price === "number" ? item.price : Number(item.price) || 0,
        image:    item.image || item.primary_image || item.images?.[0] || "",
        size:     "M",
        quantity: 1,
      })
    );
    setQuickAddId(item.id);
    setTimeout(() => setQuickAddId(null), 1500);
  };

  return (
    <div style={styles.page}>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          isolation: "isolate",
          overflow: "hidden",
        }}
      >
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(17,17,17,0.30) 0%, rgba(17,17,17,0.56) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: "0 18px",
          }}
        >
          <div style={{ maxWidth: 900 }}>
            <p
              style={{
                ...styles.sectionLabel,
                color: "rgba(250,249,246,.78)",
                marginBottom: 18,
              }}
            >
            </p>

            <h1
              className="font-display"
              style={{
                fontSize: "clamp(52px, 12vw, 118px)",
                color: "#faf9f6",
                fontWeight: 300,
                lineHeight: 0.95,
                margin: 0,
                textShadow: "0 10px 28px rgba(0,0,0,0.25)",
              }}
            >
            </h1>

            <p
              style={{
                color: "rgba(250,249,246,.86)",
                fontSize: "clamp(10px,2vw,11px)",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                margin: "18px 0 32px",
              }}
            >
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {/* <Link to="/shop" style={styles.ctaPrimary}>
                Shop Now
              </Link> */}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              right: 14,
              bottom: 18,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "rgba(250,249,246,0.66)",
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                writingMode: "vertical-rl",
              }}
            >
              Scroll
            </span>
            <ChevronDown size={14} />
          </div>
        )}
      </section>

      {/* ── MARQUEE ── */}
      <section
        style={{
          background:
            "linear-gradient(90deg, #1a1a1a 0%, #202020 46%, #1a1a1a 100%)",
          borderTop: "1px solid rgba(250,249,246,0.1)",
          borderBottom: "1px solid rgba(250,249,246,0.1)",
          padding: "14px 0",
          overflow: "hidden",
        }}
      >
        <div
          className="animate-marquee"
          style={{ display: "flex", whiteSpace: "nowrap" }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={`${item}-${i}`}
              style={{
                color: "rgba(250,249,246,.78)",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 22px",
              }}
            >
              {item}
              <span style={{ color: "#b59a76", margin: "0 12px" }}>✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section style={styles.sectionPad}>
        <div style={styles.container}>
          <div
            style={{
              ...styles.sectionHead,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={{ width: "100%" }}>
              <p style={styles.sectionLabel}>Top Picks</p>
              <h2 className="font-display" style={styles.sectionTitle}>
                Best Sellers
              </h2>
            </div>

            <Link to="/shop" style={styles.viewAll}>
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {featured.length === 0 ? (
            <SkeletonGrid />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(160px, 100%), 1fr))",
                gap: 16,
              }}
            >
              {featured.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  isAdded={quickAddId === item.id}
                  onQuickAdd={() => handleQuickAdd(item)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STORY ── */}
      <section
        style={{
          ...styles.sectionPad,
          background:
            "radial-gradient(circle at top, #2b2b2b 0%, #1f1f1f 42%, #161616 100%)",
          marginTop: 12,
        }}
      >
        <div
          style={{
            ...styles.container,
            maxWidth: 820,
            textAlign: "center",
            paddingInline: 12,
          }}
        >
          <p
            style={{
              ...styles.sectionLabel,
              color: "#bea37e",
              marginBottom: 20,
            }}
          >
            Our Story
          </p>

          <h2
            className="font-display"
            style={{
              fontSize: "clamp(28px, 6vw, 58px)",
              color: "#faf9f6",
              lineHeight: 1.16,
              fontWeight: 300,
              margin: "0 0 20px",
            }}
          >
            Clothing that travels
            <br />
            as far as you do
          </h2>

          <p
            style={{
              maxWidth: 560,
              margin: "0 auto 36px",
              color: "rgba(250,249,246,0.72)",
              lineHeight: 1.9,
              fontSize: 14,
            }}
          >
            Masafir was born from a love of journeys — the places we go, the
            people we meet, and the stories we carry back. Every piece is
            designed to move with you.
          </p>

          <Link
            to="/shop"
            style={styles.ctaGhost}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#faf9f6";
              e.currentTarget.style.color = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#faf9f6";
            }}
          >
            Discover More
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ── Skeleton ── */
function SkeletonGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(170px, 100%), 1fr))",
        gap: 16,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div
            style={{
              aspectRatio: "3/4",
              background:
                "linear-gradient(90deg, #f1ece4 25%, #ece5db 37%, #f1ece4 63%)",
              backgroundSize: "300% 100%",
              marginBottom: 12,
              borderRadius: 8,
            }}
          />
          <div
            style={{
              height: 10,
              width: "72%",
              borderRadius: 999,
              backgroundColor: "#ece5db",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 10,
              width: "44%",
              borderRadius: 999,
              backgroundColor: "#ece5db",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ item, isAdded, onQuickAdd, isMobile }) {
  const [hovered, setHovered] = useState(false);

  const imageSrc = item.image || item.primary_image || item.images?.[0];
  const showQuickAdd = hovered || isMobile;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%" }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4/5",
          backgroundColor: "#ece4da",
          overflow: "hidden",
          borderRadius: 12,
          marginBottom: 10,
        }}
      >
        <Link
          to={`/product/${item.slug}`}
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          <img
            src={imageSrc}
            alt={item.name}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform .45s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        </Link>

        {item.tag && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "rgba(26,26,26,0.9)",
              color: "#faf9f6",
              padding: "4px 9px",
              borderRadius: 999,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {item.tag}
          </span>
        )}

        <button
          onClick={onQuickAdd}
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            bottom: 8,
            border: "none",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            backgroundColor: isAdded ? "#b89870" : "#1a1a1a",
            color: "#faf9f6",
            transition: "opacity 0.25s ease",
            opacity: showQuickAdd ? 1 : 0,
            pointerEvents: showQuickAdd ? "auto" : "none",
          }}
        >
          {isAdded ? "Added" : "Quick Add"}
        </button>
      </div>

      <Link
        to={`/product/${item.slug}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <p
          style={{
            margin: "0 0 5px",
            fontSize: 13,
            lineHeight: 1.45,
            color: "#2a2a2a",
            fontWeight: 550,
          }}
        >
          {item.name}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: "0.03em",
            color: "#9a7d57",
            fontWeight: 550,
          }}
        >
          {`Rs ${Number(item.price || 0).toLocaleString("en-PK")}`}
        </p>
      </Link>
    </article>
  );
}