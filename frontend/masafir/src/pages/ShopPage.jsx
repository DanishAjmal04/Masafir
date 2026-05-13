import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";
import { addToCart } from "../store/cartSlice.js";
import { useProducts } from "../hooks/useProduct.js"; // ✅ fix

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ShopPage() {
  const { category } = useParams();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [quickAddId, setQuickAddId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { products, loading, error } = useProducts({
    gender: category && category !== "all" ? category : undefined,
    search: search || undefined,
  });

  const handleQuickAdd = (product) => {
    dispatch(
      addToCart({
        id:       product.id,
        name:     product.name,
        price:    parseFloat(product.price),          // ✅ fix — string hoti hai Django se
        image:    product.primary_image || product.image || "",
        size:     "M",
        quantity: 1,
      })
    );
    setQuickAddId(product.id);
    setTimeout(() => setQuickAddId(null), 1600);
  };

  const headingMap = {
    women:       "Women",
    men:         "Men",
    new:         "New Arrivals",
    sale:        "Sale",
    collections: "Collections",
  };
  const heading = headingMap[category] || "All Pieces";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #fffdf8 0%, #faf9f6 45%, #f5f1ea 100%)",
        paddingTop:    isMobile ? "92px"  : "110px",
        paddingBottom: isMobile ? "60px"  : "90px",
      }}
    >
      <div
        style={{
          width:        "min(1280px, 100%)",
          margin:       "0 auto",
          paddingLeft:  isMobile ? "16px" : "32px",
          paddingRight: isMobile ? "16px" : "32px",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? "28px" : "42px" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a7a62", marginBottom: 10 }}>
            Masafir
          </p>
          <h1
            className="font-display"
            style={{ fontSize: isMobile ? "38px" : "clamp(42px, 6vw, 60px)", color: "#1a1a1a", fontWeight: 300, lineHeight: 1.05, margin: 0 }}
          >
            {heading}
          </h1>
        </div>

        {/* SEARCH */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: isMobile ? "26px" : "38px" }}>
          <div style={{ position: "relative", width: isMobile ? "100%" : "min(430px, 90vw)" }}>
            <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6a6257" }} />
            <input
              type="text"
              placeholder="Search pieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", height: isMobile ? 46 : 44, paddingLeft: 40, paddingRight: 14, borderRadius: 999, border: "1px solid #e2d9cb", backgroundColor: "rgba(255,255,255,0.7)", color: "#1a1a1a", outline: "none", fontSize: 12, letterSpacing: "0.05em", boxSizing: "border-box" }}
            />
          </div>
          <p style={{ fontSize: 11, color: "#4d4d4d", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
            {loading ? "Loading..." : `${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", padding: "90px 0" }}>
            <p style={{ fontSize: 12, color: "#5c554b", letterSpacing: "0.14em", textTransform: "uppercase" }}>Loading...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "90px 0" }}>
            <p style={{ fontSize: 14, color: "#ef4444" }}>
              {typeof error === "string" ? error : "Something went wrong."}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "90px 0" }}>
            <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8a7a62", marginBottom: 12 }}>No Results</p>
            <p className="font-display" style={{ fontSize: isMobile ? 32 : 42, color: "#1a1a1a", fontWeight: 300, marginBottom: 12 }}>Nothing found</p>
            <p style={{ fontSize: 13, color: "#4d4d4d", marginBottom: 24 }}>Try another keyword to explore more products.</p>
            <button
              onClick={() => setSearch("")}
              style={{ border: "1px solid #1a1a1a", background: "transparent", color: "#1a1a1a", padding: "11px 22px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", borderRadius: 999 }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && !error && products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(230px, 1fr))",
              gap: isMobile ? 14 : 20,
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdded={quickAddId === product.id}
                onQuickAdd={() => handleQuickAdd(product)}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, isAdded, onQuickAdd, isMobile }) {
  const [hovered, setHovered] = useState(false);
  const imageSrc = product.primary_image || product.image || "";

  return (
    <article
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      <div
        style={{ position: "relative", aspectRatio: "4/5", backgroundColor: "#ede8df", overflow: "hidden", borderRadius: isMobile ? 12 : 14, marginBottom: 12 }}
      >
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered && !isMobile ? "scale(1.04)" : "scale(1)", transition: "transform .55s ease" }}
          />
        </Link>

        {product.tag && (
          <span
            style={{ position: "absolute", top: 10, left: 10, backgroundColor: "rgba(26,26,26,.92)", color: "#faf9f6", fontSize: isMobile ? 9 : 10, padding: isMobile ? "4px 7px" : "4px 8px", borderRadius: 999, letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            {product.tag}
          </span>
        )}

        {(hovered || isMobile) && (
          <button
            onClick={onQuickAdd}
            style={{ position: "absolute", left: 8, right: 8, bottom: 8, border: "none", borderRadius: 10, padding: isMobile ? "11px 12px" : "10px 12px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", backgroundColor: isAdded ? "#b89870" : "#1a1a1a", color: "#faf9f6", backdropFilter: "blur(6px)" }}
          >
            {isAdded ? "Added ✓" : "Quick Add"}
          </button>
        )}
      </div>

      <Link to={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
        <p style={{ fontSize: isMobile ? 12 : 14, color: "#2f2f2f", lineHeight: 1.45, margin: "0 0 4px", fontWeight: 600 }}>
          {product.name}
        </p>
        <p style={{ fontSize: isMobile ? 11 : 12, color: "#9b7d57", letterSpacing: "0.03em", margin: 0, fontWeight: 600 }}>
          {formatPKR(parseFloat(product.price))}
        </p>
      </Link>
    </article>
  );
}