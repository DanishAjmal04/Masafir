import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, Minus, Plus, Share2, ChevronDown } from "lucide-react";
import { addToCart } from "../store/cartSlice.js";
import { useProduct } from "../hooks/useProduct";
import { reviewService } from "../services/reviewService";
import "@fontsource/figtree";
import ReviewsSection from "../components/ReviewsSection.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const RADIUS = { sm: "8px", md: "10px", lg: "12px", pill: "999px" };

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);

  return mobile;
}

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { product, loading, error } = useProduct(slug);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const sizes = [...new Set(product?.variants?.map((v) => v.size) || [])];
  const colors = [...new Set(product?.variants?.map((v) => v.color).filter(Boolean) || [])];

  const images =
    product?.images
      ?.map((img) => (typeof img === "string" ? img : img.image))
      .filter(Boolean) || [];

  useEffect(() => {
    if (colors.length) setSelectedColor(colors[0]);
    setActiveImage(0);
    setSelectedSize(null);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: images[0] || "",
        size: selectedSize,
        color: selectedColor || "",
        quantity,
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#faf9f6",
          paddingTop: "96px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "#4d4d4d",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Loading…
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#faf9f6",
          paddingTop: "96px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          fontFamily: "'Figtree', sans-serif",
        }}
      >
        <p style={{ fontSize: "13px", color: "#ef4444" }}>
          {typeof error === "string" ? error : "Product not found."}
        </p>

        <Link
          to="/shop"
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#1a1a1a",
            textDecoration: "none",
          }}
        >
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const avgRating = product.avg_rating || "0.0";
  const reviewCount = product.review_count || 0;
  const totalImages = images.length || 1;

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#faf9f6",
        paddingTop: isMobile ? "72px" : "96px",
        paddingBottom: isMobile ? "48px" : "96px",
        fontFamily: "'Figtree', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 24px",
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: isMobile ? "20px" : "40px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#4d4d4d",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{ color: "#4d4d4d", textDecoration: "none" }}
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/shop"
            style={{ color: "#4d4d4d", textDecoration: "none" }}
          >
            Shop
          </Link>

          {categoryName && (
            <>
              <span>/</span>

              <Link
                to={`/shop/${product.gender}`}
                style={{ color: "#4d4d4d", textDecoration: "none" }}
              >
                {categoryName}
              </Link>
            </>
          )}

          <span>/</span>

          <span style={{ color: "#1a1a1a" }}>{product.name}</span>
        </div>

        {/* Main Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "24px" : "64px",
            alignItems: "start",
          }}
        >
          {/* IMAGE SECTION */}
          {isMobile ? (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  backgroundColor: "#ede8df",
                  borderRadius: RADIUS.lg,
                  position: "relative",
                }}
              >
                <img
                  src={images[activeImage] || ""}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {product.tag && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      backgroundColor: "#1a1a1a",
                      color: "#faf9f6",
                      fontSize: "10px",
                      padding: "4px 12px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      borderRadius: RADIUS.pill,
                    }}
                  >
                    {product.tag}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "16px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "72px",
                  flexShrink: 0,
                }}
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      aspectRatio: "1",
                      overflow: "hidden",
                      border:
                        i === activeImage
                          ? "1px solid #1a1a1a"
                          : "1px solid transparent",
                      opacity: i === activeImage ? 1 : 0.5,
                      cursor: "pointer",
                      padding: 0,
                      backgroundColor: "transparent",
                      borderRadius: RADIUS.md,
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, position: "relative" }}>
                <div
                  style={{
                    aspectRatio: "3/4",
                    overflow: "hidden",
                    backgroundColor: "#ede8df",
                    borderRadius: RADIUS.lg,
                  }}
                >
                  <img
                    src={images[activeImage] || ""}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRODUCT INFO */}
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8a7a62",
                marginBottom: "10px",
              }}
            >
              {categoryName}
            </p>

            <h1
              style={{
                fontSize: isMobile ? "28px" : "40px",
                color: "#1a1a1a",
                fontWeight: 600,
                lineHeight: 1.15,
                marginBottom: "14px",
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "13px",
                      color:
                        s <= Math.round(avgRating)
                          ? "#b89870"
                          : "#e0d9ce",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <span
                style={{
                  fontSize: "11px",
                  color: "#4d4d4d",
                }}
              >
                {avgRating} ({reviewCount} reviews)
              </span>
            </div>

            <p
              style={{
                fontSize: isMobile ? "22px" : "26px",
                color: "#1a1a1a",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              {formatPKR(parseFloat(product.price))}
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "#4d4d4d",
                lineHeight: 1.8,
                marginBottom: "24px",
                paddingTop: "24px",
                borderTop: "1px solid #ede8df",
              }}
            >
              {product.description}
            </p>

            {/* Colors */}
            {colors.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#3a3a3a",
                    marginBottom: "10px",
                  }}
                >
                  Colour —{" "}
                  <span style={{ fontWeight: 600 }}>{selectedColor}</span>
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: "6px 14px",
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        borderRadius: RADIUS.pill,
                        border: `1px solid ${
                          selectedColor === color
                            ? "#1a1a1a"
                            : "#e0d9ce"
                        }`,
                        backgroundColor:
                          selectedColor === color
                            ? "#1a1a1a"
                            : "transparent",
                        color:
                          selectedColor === color
                            ? "#faf9f6"
                            : "#3a3a3a",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "'Figtree', sans-serif",
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                    color: sizeError ? "#ef4444" : "#3a3a3a",
                  }}
                >
                  {sizeError ? "Please select a size" : "Size"}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      style={{
                        width: "46px",
                        height: "40px",
                        borderRadius: RADIUS.md,
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        border:
                          selectedSize === size
                            ? "1px solid #1a1a1a"
                            : "1px solid #e0d9ce",
                        backgroundColor:
                          selectedSize === size
                            ? "#1a1a1a"
                            : "#faf9f6",
                        color:
                          selectedSize === size
                            ? "#faf9f6"
                            : "#3a3a3a",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        fontFamily: "'Figtree', sans-serif",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Cart */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #e0d9ce",
                  borderRadius: RADIUS.md,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  style={{
                    width: "40px",
                    height: "48px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <Minus size={11} />
                </button>

                <span
                  style={{
                    width: "40px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                  }}
                >
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: "40px",
                    height: "48px",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                >
                  <Plus size={11} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: "12px",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "none",
                  borderRadius: RADIUS.md,
                  cursor: "pointer",
                  backgroundColor: added ? "#b89870" : "#1a1a1a",
                  color: "#faf9f6",
                  fontFamily: "'Figtree', sans-serif",
                }}
              >
                {added ? "✦ Added to Cart" : "Add to Cart"}
              </button>

              <button
                style={{
                  width: "48px",
                  height: "48px",
                  border: "1px solid #e0d9ce",
                  borderRadius: RADIUS.md,
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#4d4d4d",
                  flexShrink: 0,
                }}
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
        </div>

        <ReviewsSection
          productSlug={slug}
          avgRating={avgRating}
          reviewCount={reviewCount}
        />

        <RelatedProducts
          currentId={product.id}
          gender={product.gender}
        />
      </div>
    </div>
  );
}