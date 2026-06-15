import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "../hooks/useProduct";
import { addToCart } from "../store/cartSlice.js";
import heroVideo from "../assets/car.mp4";
import storyBg from "../assets/3.jpg";
const videoURL="https://res.cloudinary.com/dyzzdnqs8/video/upload/q_auto/f_auto/v1778841953/car_cdeuav.mp4"
const marqueeItems = [
  "New Arrivals",
  "Luxury Fabrics",
  "Slow Fashion",
  "Crafted in Pakistan",
  "Free Shipping Over PKR 5,000",
];

const styles = {
  page: {
    background: "radial-gradient(circle at top, #fffdf8 0%, #faf9f6 42%, #f7f4ef 100%)",
    color: "#1a1a1a",
    overflowX: "hidden",
    fontFamily: "'Figtree', sans-serif",
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
    fontFamily: "'Figtree', sans-serif",
  },
  sectionTitle: {
    fontSize: "clamp(28px, 5vw, 44px)",
    lineHeight: 1.1,
    fontWeight: 300,
    margin: 0,
    fontFamily: "'Figtree', sans-serif",
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
    fontFamily: "'Figtree', sans-serif",
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
    fontFamily: "'Figtree', sans-serif",
  },
};

function MarqueeBar() {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, #1a1a1a 0%, #202020 46%, #1a1a1a 100%)",
        borderBottom: "1px solid rgba(250,249,246,0.1)",
        padding: "14px 0",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div className="animate-marquee" style={{ display: "flex", whiteSpace: "nowrap" }}>
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span
            key={`${item}-${i}`}
            style={{
              color: "rgba(250,249,246,.78)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 22px",
              fontFamily: "'Figtree', sans-serif",
            }}
          >
            {item}
            <span style={{ color: "#b59a76", margin: "0 12px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [quickAddId, setQuickAddId] = useState(null);
  const [isMobile,   setIsMobile]   = useState(window.innerWidth < 768);
  const [showMarquee, setShowMarquee] = useState(false);
  const heroRef = useRef(null);

  const dispatch = useDispatch();
  const featured = useFeaturedProducts();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
  const onScroll = () => setShowMarquee(window.scrollY > 60);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  const handleQuickAdd = (item) => {
    dispatch(
      addToCart({
        id:       item.id,
        name:     item.name,
        price:    typeof item.price === "number" ? item.price : Number(item.price) || 0,
        image:    item.primary_image || item.image || item.images?.[0] || "",
        size:     "M",
        quantity: 1,
      })
    );
    setQuickAddId(item.id);
    setTimeout(() => setQuickAddId(null), 1500);
  };

  return (
    <div style={styles.page}>

      <div
        style={{
          position: "fixed",
          top: isMobile ? "56px" : "64px",
          left: 0,
          right: 0,
          zIndex: 40,
          transform: showMarquee ? "translateY(0)" : "translateY(-120%)",
          opacity: showMarquee ? 1 : 0,
          visibility: showMarquee ? "visible" : "hidden",
          transition: "transform 0.45s ease, opacity 0.3s ease",
          pointerEvents: showMarquee ? "auto" : "none",
        }}
      >
        <MarqueeBar />
      </div>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position:  "relative",
          minHeight: "100vh",
          isolation: "isolate",
          overflow:  "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position:   "absolute",
            inset:      0,
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
          }}
        >
          <source src={videoURL} type="video/mp4" />
        </video>

        <div
          style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(180deg, rgba(17,17,17,0.30) 0%, rgba(17,17,17,0.56) 100%)",
          }}
        />

        {/* ── Shop Now button — bottom centre ── */}
        <div
  style={{
    position:       "relative",
    zIndex:         2,
    minHeight:      "100vh",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "flex-end",
    padding:        "90px 18px",
  }}
>
  <p
    style={{
      fontFamily:    "'Figtree', sans-serif",
      fontSize:      "clamp(20px, 1.6vw, 18px)",
      fontWeight:    200,
      color:         "#faf9f6",
      letterSpacing: "0.08em",
      textAlign:     "center",
      marginBottom:  "20px",
      opacity:       0.85,
    }}
  >
    Weaving South Asia's Heritage<br />into Modern Attire
  </p>

  <Link
    to="/shop"
    style={{ ...styles.ctaGhost, width: "220px", textAlign: "center" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#faf9f6";
      e.currentTarget.style.color           = "#1a1a1a";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color           = "#faf9f6";
    }}
  >
    Shop Now
  </Link>
</div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={styles.sectionPad}>
        <div style={styles.container}>
          <div
            style={{
              ...styles.sectionHead,
              justifyContent: "center",
              textAlign:      "center",
            }}
          >
            <div style={{ width: "100%" }}>
              <h2 className="font-display" style={styles.sectionTitle}>
                Featured Products
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
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))",
                gap:                 16,
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

      {/* ── OUR STORY ── */}
      <section
        style={{
          ...styles.sectionPad,
          position:   "relative",
          marginTop:  12,
          overflow:   "hidden",
        }}
      >
        <div
          style={{
            position:           "absolute",
            inset:              0,
            backgroundImage:    `url(${storyBg})`,
            backgroundSize:     "cover",
            backgroundPosition: "center",
            backgroundRepeat:   "no-repeat",
          }}
        />

        <div
          style={{
            position:   "absolute",
            inset:      0,
            background: "linear-gradient(180deg, rgba(15,15,14,0.65) 0%, rgba(15,15,14,0.82) 100%)",
          }}
        />

        <div
          style={{
            position:      "relative",
            zIndex:        2,
            ...styles.container,
            maxWidth:      820,
            textAlign:     "center",
            paddingInline: "clamp(16px, 4vw, 48px)",
          }}
        >
          <p
            style={{
              ...styles.sectionLabel,
              color:        "#bea37e",
              marginBottom: 20,
            }}
          >
            Our Story
          </p>

          <h2
            className="font-display"
            style={{
              fontSize:   "clamp(28px, 6vw, 58px)",
              color:      "#faf9f6",
              lineHeight: 1.16,
              fontWeight: 300,
              margin:     "0 0 20px",
              fontFamily: "'Figtree', sans-serif",
            }}
          >
            Clothing that travels
            <br />
            as far as you do
          </h2>

          <p
            style={{
              maxWidth:   560,
              margin:     "0 auto 36px",
              color:      "rgba(250,249,246,0.72)",
              lineHeight: 1.9,
              fontSize:   14,
              fontFamily: "'Figtree', sans-serif",
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
              e.currentTarget.style.color           = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color           = "#faf9f6";
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
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(170px, 100%), 1fr))",
        gap:                 16,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div
            style={{
              aspectRatio:     "3/4",
              background:      "linear-gradient(90deg, #f1ece4 25%, #ece5db 37%, #f1ece4 63%)",
              backgroundSize:  "300% 100%",
              marginBottom:    12,
              borderRadius:    8,
            }}
          />
          <div style={{ height: 10, width: "72%", borderRadius: 999, backgroundColor: "#ece5db", marginBottom: 8 }} />
          <div style={{ height: 10, width: "44%", borderRadius: 999, backgroundColor: "#ece5db" }} />
        </div>
      ))}
    </div>
  );
}

/* ── Product Card ── */
function ProductCard({ item, isAdded, onQuickAdd, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const imageSrc    = item.primary_image || item.image || item.images?.[0];
  const showQuickAdd = hovered || isMobile;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "100%" }}
    >
      <div
        style={{
          position:        "relative",
          aspectRatio:     "4/5",
          backgroundColor: "#ece4da",
          overflow:        "hidden",
          borderRadius:    12,
          marginBottom:    10,
        }}
      >
        <Link to={`/product/${item.slug}`} style={{ display: "block", width: "100%", height: "100%" }}>
          <img
            src={imageSrc}
            alt={item.name}
            loading="lazy"
            decoding="async"
            style={{
              width:      "100%",
              height:     "100%",
              objectFit:  "cover",
              transition: "transform .45s ease",
              transform:  hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        </Link>

        {item.tag && (
          <span
            style={{
              position:        "absolute",
              top:             10,
              left:            10,
              backgroundColor: "rgba(26,26,26,0.9)",
              color:           "#faf9f6",
              padding:         "4px 9px",
              borderRadius:    999,
              fontSize:        10,
              letterSpacing:   "0.12em",
              textTransform:   "uppercase",
              fontFamily:      "'Figtree', sans-serif",
            }}
          >
            {item.tag}
          </span>
        )}

        <button
          onClick={onQuickAdd}
          style={{
            position:        "absolute",
            left:            8,
            right:           8,
            bottom:          8,
            border:          "none",
            borderRadius:    8,
            padding:         "10px 12px",
            fontSize:        10,
            letterSpacing:   "0.14em",
            textTransform:   "uppercase",
            cursor:          "pointer",
            backgroundColor: isAdded ? "#b89870" : "#1a1a1a",
            color:           "#faf9f6",
            transition:      "opacity 0.25s ease",
            opacity:         showQuickAdd ? 1 : 0,
            pointerEvents:   showQuickAdd ? "auto" : "none",
            fontFamily:      "'Figtree', sans-serif",
          }}
        >
          {isAdded ? "Added" : "Quick Add"}
        </button>
      </div>

      <Link to={`/product/${item.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        <p style={{ margin: "0 0 5px", fontSize: 13, lineHeight: 1.45, color: "#2a2a2a", fontWeight: 550, fontFamily: "'Figtree', sans-serif" }}>
          {item.name}
        </p>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.03em", color: "#9a7d57", fontWeight: 550, fontFamily: "'Figtree', sans-serif" }}>
          {`Rs ${Number(item.price || 0).toLocaleString("en-PK")}`}
        </p>
      </Link>
    </article>
  );
}