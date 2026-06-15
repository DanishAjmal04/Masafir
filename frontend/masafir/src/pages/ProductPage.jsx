import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, Minus, Plus, ChevronDown } from "lucide-react";
import { addToCart } from "../store/cartSlice.js";
import { useProduct } from "../hooks/useProduct";
import { reviewService } from "../services/reviewService";

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
  const { slug }    = useParams();
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const isMobile    = useIsMobile();
  const { product, loading, error } = useProduct(slug);

  const [activeImage,   setActiveImage]   = useState(0);
  const [selectedSize,  setSelectedSize]  = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity,      setQuantity]      = useState(1);
  const [added,         setAdded]         = useState(false);
  const [sizeError,     setSizeError]     = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const sizes  = [...new Set(product?.variants?.map((v) => v.size)                 || [])];
  const colors = [...new Set(product?.variants?.map((v) => v.color).filter(Boolean) || [])];

  const images = product?.images?.map((img) =>
    typeof img === "string" ? img : img.image
  ).filter(Boolean) || [];

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
    dispatch(addToCart({
      id:       product.id,
      name:     product.name,
      price:    parseFloat(product.price),
      image:    images[0] || "",
      size:     selectedSize,
      color:    selectedColor || "",
      quantity,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    dispatch(addToCart({
      id:       product.id,
      name:     product.name,
      price:    parseFloat(product.price),
      image:    images[0] || "",
      size:     selectedSize,
      color:    selectedColor || "",
      quantity,
    }));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#faf9f6", paddingTop: "96px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Figtree', sans-serif" }}>Loading…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#faf9f6", paddingTop: "96px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>
          {typeof error === "string" ? error : "Product not found."}
        </p>
        <Link to="/shop" style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a1a", fontFamily: "'Figtree', sans-serif" }}>← Back to Shop</Link>
      </div>
    );
  }

  const avgRating    = product.avg_rating   || "0.0";
  const reviewCount  = product.review_count || 0;
  const totalImages  = images.length        || 1;
  const categoryName = typeof product.category === "object"
    ? product.category?.name
    : product.category || "";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#faf9f6", paddingTop: isMobile ? "72px" : "96px", paddingBottom: isMobile ? "48px" : "96px", fontFamily: "'Figtree', sans-serif" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: isMobile ? "0 16px" : "0 24px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: isMobile ? "20px" : "40px", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#4d4d4d", fontWeight: 300, flexWrap: "wrap" }}>
          <Link to="/"     style={{ color: "#4d4d4d", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: "#4d4d4d", textDecoration: "none" }}>Shop</Link>
          {categoryName && (
            <>
              <span>/</span>
              <Link to={`/shop/${product.gender}`} style={{ color: "#4d4d4d", textDecoration: "none" }}>{categoryName}</Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: "#1a1a1a" }}>{product.name}</span>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "24px" : "64px", alignItems: "start" }}>

          {/* IMAGE GALLERY */}
          {isMobile ? (
            <div style={{ position: "relative" }}>
              <div style={{ aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#ede8df", borderRadius: RADIUS.lg, position: "relative" }}>
                <img src={images[activeImage] || ""} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {product.tag && (
                  <span style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#1a1a1a", color: "#faf9f6", fontSize: "10px", padding: "4px 12px", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: RADIUS.pill, fontFamily: "'Figtree', sans-serif" }}>
                    {product.tag}
                  </span>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage((p) => (p - 1 + totalImages) % totalImages)}
                      style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", border: "none", backgroundColor: "rgba(255,255,255,0.85)", cursor: "pointer", width: "36px", height: "36px", borderRadius: RADIUS.pill, display: "flex", alignItems: "center", justifyContent: "center", color: "#1a1a1a" }}>
                      <ArrowLeft size={16} />
                    </button>
                    <button onClick={() => setActiveImage((p) => (p + 1) % totalImages)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", border: "none", backgroundColor: "rgba(255,255,255,0.85)", cursor: "pointer", width: "36px", height: "36px", borderRadius: RADIUS.pill, display: "flex", alignItems: "center", justifyContent: "center", color: "#1a1a1a" }}>
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      style={{ width: i === activeImage ? "20px" : "6px", height: "6px", borderRadius: RADIUS.pill, backgroundColor: i === activeImage ? "#1a1a1a" : "#ccc", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s" }} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "72px", flexShrink: 0 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    style={{ aspectRatio: "1", overflow: "hidden", border: i === activeImage ? "1px solid #1a1a1a" : "1px solid transparent", opacity: i === activeImage ? 1 : 0.5, cursor: "pointer", padding: 0, backgroundColor: "transparent", borderRadius: RADIUS.md }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#ede8df", position: "relative", borderRadius: RADIUS.lg }}>
                  <img src={images[activeImage] || ""} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {product.tag && (
                    <span style={{ position: "absolute", top: "16px", left: "16px", backgroundColor: "#1a1a1a", color: "#faf9f6", fontSize: "10px", padding: "4px 12px", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: RADIUS.pill, fontFamily: "'Figtree', sans-serif" }}>
                      {product.tag}
                    </span>
                  )}
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage((p) => (p - 1 + totalImages) % totalImages)}
                      style={{ position: "absolute", left: "12px", top: "45%", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#faf9f6", width: "32px", height: "32px", borderRadius: RADIUS.pill, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))" }}>
                      <ArrowLeft size={22} />
                    </button>
                    <button onClick={() => setActiveImage((p) => (p + 1) % totalImages)}
                      style={{ position: "absolute", right: "12px", top: "45%", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#faf9f6", width: "32px", height: "32px", borderRadius: RADIUS.pill, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))" }}>
                      <ArrowRight size={22} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* PRODUCT INFO */}
          <div>
            <p className="section-label" style={{ marginBottom: "10px", fontFamily: "'Figtree', sans-serif" }}>{categoryName}</p>
            <h1 className="font-display" style={{ fontSize: isMobile ? "28px" : "40px", color: "#1a1a1a", fontWeight: 300, lineHeight: 1.15, marginBottom: "14px", fontFamily: "'Figtree', sans-serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{ fontSize: "13px", color: s <= Math.round(avgRating) ? "#b89870" : "#e0d9ce" }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: "11px", color: "#4d4d4d", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>{avgRating} ({reviewCount} reviews)</span>
            </div>

            <p className="font-display" style={{ fontSize: isMobile ? "22px" : "26px", color: "#1a1a1a", fontWeight: 300, marginBottom: "24px", fontFamily: "'Figtree', sans-serif" }}>
              {formatPKR(parseFloat(product.price))}
            </p>

            <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, lineHeight: 1.8, marginBottom: "24px", paddingTop: "24px", borderTop: "1px solid #ede8df", fontFamily: "'Figtree', sans-serif" }}>
              {product.description}
            </p>

            {/* Colors */}
            {colors.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#3a3a3a", marginBottom: "10px", fontFamily: "'Figtree', sans-serif" }}>
                  Colour — <span style={{ fontWeight: 500 }}>{selectedColor}</span>
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      style={{ padding: "6px 14px", fontSize: "11px", letterSpacing: "0.08em", borderRadius: RADIUS.pill, border: `1px solid ${selectedColor === color ? "#1a1a1a" : "#e0d9ce"}`, backgroundColor: selectedColor === color ? "#1a1a1a" : "transparent", color: selectedColor === color ? "#faf9f6" : "#3a3a3a", cursor: "pointer", transition: "all 0.2s", fontFamily: "'Figtree', sans-serif" }}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 300, color: sizeError ? "#ef4444" : "#3a3a3a", fontFamily: "'Figtree', sans-serif" }}>
                    {sizeError ? "Please select a size" : "Size"}
                  </p>
                  <Link
                    to="/size-guide"
                    style={{ fontSize: "11px", color: "#4d4d4d", textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: 300, border: "none", backgroundColor: "transparent", cursor: "pointer", borderRadius: RADIUS.sm, padding: "4px 8px", fontFamily: "'Figtree', sans-serif" }}
                  >
                    Size Guide
                  </Link>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {sizes.map((size) => {
                    const variant = product.variants?.find((v) => v.size === size && (!selectedColor || v.color === selectedColor));
                    const inStock = variant ? variant.in_stock : true;
                    return (
                      <button key={size}
                        onClick={() => { if (inStock) { setSelectedSize(size); setSizeError(false); } }}
                        disabled={!inStock}
                        style={{ width: "46px", height: "40px", borderRadius: RADIUS.md, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 300, border: `1px solid ${selectedSize === size ? "#1a1a1a" : "#e0d9ce"}`, backgroundColor: selectedSize === size ? "#1a1a1a" : "#faf9f6", color: selectedSize === size ? "#faf9f6" : !inStock ? "#c4b8a8" : "#3a3a3a", cursor: inStock ? "pointer" : "not-allowed", opacity: inStock ? 1 : 0.5, transition: "all 0.15s", textDecoration: !inStock ? "line-through" : "none", fontFamily: "'Figtree', sans-serif" }}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0d9ce", borderRadius: RADIUS.md, overflow: "hidden", flexShrink: 0 }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1}
                  style={{ width: isMobile ? "36px" : "40px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#4d4d4d", opacity: quantity <= 1 ? 0.3 : 1 }}>
                  <Minus size={11} />
                </button>
                <span style={{ width: isMobile ? "36px" : "40px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#1a1a1a", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>
                  {quantity}
                </span>
                <button onClick={() => setQuantity((q) => q + 1)}
                  style={{ width: isMobile ? "36px" : "40px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#4d4d4d" }}>
                  <Plus size={11} />
                </button>
              </div>

              <button onClick={handleAddToCart}
                style={{ flex: 1, padding: "12px", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 300, border: "none", borderRadius: RADIUS.md, cursor: "pointer", transition: "all 0.3s", backgroundColor: added ? "#b89870" : "#1a1a1a", color: "#faf9f6", fontFamily: "'Figtree', sans-serif" }}>
                {added ? "✦ Added to Cart" : "Add to Cart"}
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              style={{ width: "100%", padding: "14px", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 300, border: "1px solid #1a1a1a", borderRadius: RADIUS.md, cursor: "pointer", backgroundColor: "transparent", color: "#1a1a1a", fontFamily: "'Figtree', sans-serif", marginBottom: "16px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1a1a1a"; e.currentTarget.style.color = "#faf9f6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1a1a1a"; }}
            >
              Buy Now
            </button>

            <p style={{ fontSize: "11px", color: "#4d4d4d", fontWeight: 300, marginBottom: "28px", fontFamily: "'Figtree', sans-serif" }}>
              Free shipping on orders over PKR 5,000
            </p>

            {/* Accordions */}
            <div style={{ borderTop: "1px solid #ede8df" }}>
              {[
                { key: "details",  label: "Product Details",    content: <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, lineHeight: 1.8, fontFamily: "'Figtree', sans-serif" }}>{product.description}</p> },
                { key: "shipping", label: "Shipping & Returns",  content: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Free standard shipping on orders over PKR 5,000. Delivery within 3–5 working days across Pakistan.</p>
                    <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Returns accepted within 14 days of delivery. Items must be unworn and in original packaging.</p>
                  </div>
                )},
                { key: "care",     label: "Care Instructions",   content: <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Machine wash cold on a gentle cycle. Do not tumble dry. Line dry in shade. Iron on low heat if needed.</p> },
              ].map(({ key, label, content }) => (
                <div key={key} style={{ borderBottom: "1px solid #ede8df" }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === key ? null : key)}
                    style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a1a", fontWeight: 300, border: "none", borderRadius: RADIUS.sm, backgroundColor: "transparent", cursor: "pointer", fontFamily: "'Figtree', sans-serif" }}
                  >
                    {label}
                    <ChevronDown size={14} style={{ transition: "transform 0.3s", transform: openAccordion === key ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                  {openAccordion === key && <div style={{ paddingBottom: "20px" }}>{content}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ReviewsSection productSlug={slug} avgRating={avgRating} reviewCount={reviewCount} />
        <RelatedProducts currentId={product.id} gender={product.gender} />
      </div>
    </div>
  );
}

/* ── Related Products ── */
function RelatedProducts({ currentId, gender }) {
  const isMobile = useIsMobile();
  const list = useSelector((s) => s.products.list);
  const related = (list || [])
    .filter((p) => p.id !== currentId && p.gender === gender)
    .slice(0, isMobile ? 2 : 4);

  if (!related.length) return null;

  return (
    <div style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid #ede8df" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: isMobile ? "24px" : "36px" }}>
        <div>
          <p className="section-label" style={{ marginBottom: "10px", fontFamily: "'Figtree', sans-serif" }}>You May Also Like</p>
          <h2 className="font-display" style={{ fontSize: isMobile ? "22px" : "28px", color: "#1a1a1a", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Related Pieces</h2>
        </div>
        <Link to="/shop" style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a1a", textDecoration: "none", fontFamily: "'Figtree', sans-serif" }}>View All →</Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "12px" : "16px" }}>
        {related.map((item) => (
          <Link key={item.id} to={`/product/${item.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ aspectRatio: "3/4", marginBottom: "12px", overflow: "hidden", backgroundColor: "#ede8df", borderRadius: RADIUS.lg }}>
              <img src={item.primary_image || ""} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ fontSize: "11px", color: "#3a3a3a", fontWeight: 300, letterSpacing: "0.04em", marginBottom: "3px", fontFamily: "'Figtree', sans-serif" }}>{item.name}</p>
            <p style={{ fontSize: "11px", color: "#a08c6e", fontFamily: "'Figtree', sans-serif" }}>{formatPKR(parseFloat(item.price))}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Reviews Section ── */
function ReviewsSection({ productSlug, avgRating, reviewCount }) {
  const isMobile = useIsMobile();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [newRating,   setNewRating]   = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData,    setFormData]    = useState({ body: "" });
  const [submitted,   setSubmitted]   = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!productSlug) return;
    reviewService.getReviews(productSlug)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.body || !newRating) return;
    setSubmitError("");
    try {
      const review = await reviewService.createReview(productSlug, { rating: newRating, body: formData.body });
      setReviews((prev) => [review, ...prev]);
      setSubmitted(true);
      setShowForm(false);
      setFormData({ body: "" });
      setNewRating(0);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || "Failed to submit review.");
    }
  };

  return (
    <div style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid #ede8df" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "12px" : 0, marginBottom: isMobile ? "24px" : "40px" }}>
        <div>
          <p className="section-label" style={{ marginBottom: "10px", fontFamily: "'Figtree', sans-serif" }}>What they say</p>
          <h2 className="font-display" style={{ fontSize: isMobile ? "22px" : "28px", color: "#1a1a1a", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Customer Reviews</h2>
        </div>
        <div style={{ textAlign: isMobile ? "left" : "right" }}>
          <div style={{ display: "flex", gap: "2px", marginBottom: "4px" }}>
            {[1,2,3,4,5].map((s) => (
              <span key={s} style={{ fontSize: "16px", color: s <= Math.round(avgRating) ? "#b89870" : "#e0d9ce" }}>★</span>
            ))}
          </div>
          <p style={{ fontSize: "11px", color: "#4d4d4d", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>{avgRating} out of 5 · {reviewCount} reviews</p>
        </div>
      </div>

      {loading ? (
        <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Loading reviews…</p>
      ) : reviews.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "20px", marginBottom: "32px" }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ border: "1px solid #ede8df", backgroundColor: "#faf9f6", padding: isMobile ? "16px" : "22px", borderRadius: RADIUS.lg }}>
              <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{ fontSize: "12px", color: s <= review.rating ? "#b89870" : "#e0d9ce" }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: "13px", color: "#3a3a3a", fontWeight: 300, lineHeight: 1.7, marginBottom: "14px", fontFamily: "'Figtree', sans-serif" }}>"{review.body}"</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "11px", color: "#1a1a1a", fontWeight: 500, fontFamily: "'Figtree', sans-serif" }}>{review.user_name}</p>
                <p style={{ fontSize: "11px", color: "#4d4d4d", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>
                  {new Date(review.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "short" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "#4d4d4d", fontWeight: 300, marginBottom: "32px", fontFamily: "'Figtree', sans-serif" }}>No reviews yet. Be the first to share your thoughts.</p>
      )}

      {submitted && (
        <div style={{ marginBottom: "20px", padding: "14px 16px", backgroundColor: "#1a1a1a", textAlign: "center", borderRadius: RADIUS.md }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(250,249,246,0.8)", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>
            ✦ &nbsp; Thank you — your review has been submitted
          </p>
        </div>
      )}

      {!isAuthenticated ? (
        <Link to="/login" style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: RADIUS.md, padding: "12px 24px", textDecoration: "none", display: "inline-block", fontFamily: "'Figtree', sans-serif" }}>
          Login to Write a Review
        </Link>
      ) : !showForm ? (
        <button onClick={() => setShowForm(true)} className="btn-outline" style={{ fontSize: "11px", letterSpacing: "0.15em", borderRadius: RADIUS.md, fontFamily: "'Figtree', sans-serif" }}>
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ border: "1px solid #ede8df", padding: isMobile ? "20px 16px" : "28px", maxWidth: isMobile ? "100%" : "560px", borderRadius: RADIUS.lg }}>
          <h3 className="font-display" style={{ fontSize: isMobile ? "20px" : "24px", color: "#1a1a1a", fontWeight: 300, marginBottom: "20px", fontFamily: "'Figtree', sans-serif" }}>Write a Review</h3>

          {submitError && <p style={{ fontSize: "12px", color: "#ef4444", marginBottom: "14px", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>{submitError}</p>}

          <div style={{ marginBottom: "18px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4d4d4d", marginBottom: "10px", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Your Rating</p>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1,2,3,4,5].map((s) => (
                <button type="button" key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setNewRating(s)}
                  style={{ fontSize: "28px", color: s <= (hoverRating || newRating) ? "#b89870" : "#e0d9ce", border: "none", backgroundColor: "transparent", cursor: "pointer", borderRadius: RADIUS.sm, padding: "0 2px" }}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4d4d4d", marginBottom: "8px", fontWeight: 300, fontFamily: "'Figtree', sans-serif" }}>Your Review</p>
            <textarea rows={4} value={formData.body} onChange={(e) => setFormData({ body: e.target.value })} placeholder="Share your experience..."
              style={{ width: "100%", border: "1px solid #e0d9ce", borderRadius: RADIUS.md, backgroundColor: "#faf9f6", padding: "12px 16px", fontSize: "13px", color: "#1a1a1a", outline: "none", resize: "none", fontWeight: 300, boxSizing: "border-box", fontFamily: "'Figtree', sans-serif" }} />
          </div>

          <div style={{ display: "flex", gap: "10px", flexDirection: isMobile ? "column" : "row" }}>
            <button type="submit" className="btn-primary" style={{ fontSize: "11px", letterSpacing: "0.15em", borderRadius: RADIUS.md, ...(isMobile && { width: "100%", justifyContent: "center" }), fontFamily: "'Figtree', sans-serif" }}>
              Submit Review
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ fontSize: "11px", letterSpacing: "0.15em", borderRadius: RADIUS.md, ...(isMobile && { width: "100%", justifyContent: "center" }), fontFamily: "'Figtree', sans-serif" }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}