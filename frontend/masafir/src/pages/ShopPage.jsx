import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Search } from "lucide-react";
import { addToCart } from "../store/cartSlice.js";
import { useProducts } from "../hooks/useProduct.js";

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
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.primary_image || product.image || "",
        size: "M",
        quantity: 1,
      })
    );

    setQuickAddId(product.id);
    setTimeout(() => setQuickAddId(null), 1600);
  };

  const headingMap = {
    women: "Women",
    men: "Men",
    new: "New Arrivals",
    sale: "Sale",
    collections: "Collections",
  };

  const heading = headingMap[category] || "All Pieces";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #fffdf8 0%, #faf9f6 45%, #f5f1ea 100%)",
        paddingTop: isMobile ? "92px" : "110px",
        paddingBottom: isMobile ? "60px" : "90px",
        fontFamily:
          "'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      <div
        style={{
          width: "min(1280px, 100%)",
          margin: "0 auto",
          paddingLeft: isMobile ? "16px" : "32px",
          paddingRight: isMobile ? "16px" : "32px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "32px" : "52px",
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#8d7b63",
              marginBottom: 14,
              fontWeight: 500,
            }}
          >
            Masafir
          </p>

          <h1
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",
              fontSize: isMobile
                ? "46px"
                : "clamp(56px, 7vw, 82px)",
              color: "#111111",
              fontWeight: 300,
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            {heading}
          </h1>
        </div>

        {/* SEARCH */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginBottom: isMobile ? "34px" : "52px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: isMobile
                ? "100%"
                : "min(460px, 90vw)",
            }}
          >
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6a6257",
              }}
            />

            <input
              type="text"
              placeholder="Search pieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                height: isMobile ? 48 : 50,
                paddingLeft: 44,
                paddingRight: 16,
                borderRadius: 999,
                border: "1px solid #e6dccf",
                backgroundColor: "rgba(255,255,255,0.78)",
                color: "#1a1a1a",
                outline: "none",
                fontSize: 12,
                letterSpacing: "0.08em",
                boxSizing: "border-box",
                fontWeight: 400,
                textTransform: "uppercase",
                backdropFilter: "blur(10px)",
              }}
            />
          </div>

          <p
            style={{
              fontSize: 10,
              color: "#5d564c",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 500,
            }}
          >
            {loading
              ? "Loading..."
              : `${products.length} ${
                  products.length === 1
                    ? "piece"
                    : "pieces"
                }`}
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "90px 0",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#5c554b",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Loading...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div
            style={{
              textAlign: "center",
              padding: "90px 0",
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "#ef4444",
              }}
            >
              {typeof error === "string"
                ? error
                : "Something went wrong."}
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "90px 0",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#8a7a62",
                  marginBottom: 14,
                  fontWeight: 500,
                }}
              >
                No Results
              </p>

              <p
                style={{
                  fontFamily:
                    "'Cormorant Garamond', serif",
                  fontSize: isMobile ? 40 : 54,
                  color: "#111111",
                  fontWeight: 300,
                  marginBottom: 14,
                  lineHeight: 1,
                }}
              >
                Nothing found
              </p>

              <p
                style={{
                  fontSize: 14,
                  color: "#5c554b",
                  marginBottom: 28,
                  letterSpacing: "0.02em",
                }}
              >
                Try another keyword to explore
                more products.
              </p>

              <button
                onClick={() => setSearch("")}
                style={{
                  border: "1px solid #1a1a1a",
                  background: "transparent",
                  color: "#1a1a1a",
                  padding: "12px 26px",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: 999,
                  fontWeight: 500,
                }}
              >
                Clear Search
              </button>
            </div>
          )}

        {/* PRODUCTS */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(auto-fit, minmax(230px, 1fr))",
                gap: isMobile ? 16 : 26,
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAdded={
                    quickAddId === product.id
                  }
                  onQuickAdd={() =>
                    handleQuickAdd(product)
                  }
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  isAdded,
  onQuickAdd,
  isMobile,
}) {
  const [hovered, setHovered] = useState(false);

  const imageSrc =
    product.primary_image ||
    product.image ||
    "";

  return (
    <article
      onMouseEnter={() =>
        !isMobile && setHovered(true)
      }
      onMouseLeave={() =>
        !isMobile && setHovered(false)
      }
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4/5",
          backgroundColor: "#ede8df",
          overflow: "hidden",
          borderRadius: isMobile ? 14 : 18,
          marginBottom: 16,
        }}
      >
        <Link
          to={`/product/${product.slug}`}
          aria-label={product.name}
        >
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform:
                hovered && !isMobile
                  ? "scale(1.045)"
                  : "scale(1)",
              transition:
                "transform .7s cubic-bezier(.19,1,.22,1)",
            }}
          />
        </Link>

        {product.tag && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor:
                "rgba(17,17,17,.92)",
              color: "#faf9f6",
              fontSize: isMobile ? 9 : 10,
              padding: isMobile
                ? "5px 8px"
                : "5px 10px",
              borderRadius: 999,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {product.tag}
          </span>
        )}

        {(hovered || isMobile) && (
          <button
            onClick={onQuickAdd}
            style={{
              position: "absolute",
              left: 10,
              right: 10,
              bottom: 10,
              border: "none",
              borderRadius: 12,
              padding: isMobile
                ? "12px 12px"
                : "12px 14px",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              backgroundColor: isAdded
                ? "#b89870"
                : "#111111",
              color: "#faf9f6",
              backdropFilter: "blur(10px)",
              fontWeight: 500,
            }}
          >
            {isAdded
              ? "Added ✓"
              : "Quick Add"}
          </button>
        )}
      </div>

      <Link
        to={`/product/${product.slug}`}
        style={{ textDecoration: "none" }}
      >
        <p
          style={{
            fontSize: isMobile ? 12 : 14,
            color: "#1f1f1f",
            lineHeight: 1.5,
            margin: "0 0 6px",
            fontWeight: 500,
            letterSpacing: "0.01em",
          }}
        >
          {product.name}
        </p>

        <p
          style={{
            fontSize: isMobile ? 11 : 12,
            color: "#9b7d57",
            letterSpacing: "0.08em",
            margin: 0,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {formatPKR(
            parseFloat(product.price)
          )}
        </p>
      </Link>
    </article>
  );
}