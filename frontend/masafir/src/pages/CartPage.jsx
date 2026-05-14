import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, ArrowRight, ShoppingBag, ArrowLeft, X, Lock } from "lucide-react";
import { removeFromCart, updateQuantity, selectCartTotal } from "../store/cartSlice.js";

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const SHIPPING_THRESHOLD = 5000;

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mobile;
}

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const remaining = Math.max(0, SHIPPING_THRESHOLD - total);
  const progressPct = Math.min(100, (total / SHIPPING_THRESHOLD) * 100);
  const shippingCost = total >= SHIPPING_THRESHOLD ? 0 : 350;
  const grandTotal = total + shippingCost;
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const isMobile = useIsMobile();

  if (items.length === 0) return <EmptyCart />;

  return (
    <div
      className="min-h-screen bg-cream-50"
      style={{ paddingTop: isMobile ? "80px" : "120px", paddingBottom: isMobile ? "40px" : "96px" }}
    >
      <div
        className="max-w-6xl mx-auto"
        style={{ paddingLeft: isMobile ? "16px" : "56px", paddingRight: isMobile ? "16px" : "24px" }}
      >
        {/* Header */}
        <div
          className="flex items-end justify-between pb-6 border-b border-cream-300"
          style={{ marginBottom: isMobile ? "20px" : "32px" }}
        >
          <div>
            <p
              className="section-label mb-2"
              style={{
                color: "#6b7280",
                letterSpacing: "0.14em",
              }}
            >
              Your Selection
            </p>

            <h1
              className="font-display text-charcoal-900 font-light"
              style={{ fontSize: isMobile ? "28px" : "42px" }}
            >
              Shopping Cart
            </h1>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-2 text-xs tracking-widest uppercase text-charcoal-600 hover:text-charcoal-900 transition-colors duration-200"
          >
            <ArrowLeft size={12} />
            {!isMobile && "Continue Shopping"}
          </Link>
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
            gap: isMobile ? "24px" : "40px",
            alignItems: "start",
          }}
        >
          {/* LEFT: Cart Items */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="border border-cream-300 bg-cream-100"
                  style={{
                    borderRadius: "12px",
                    padding: isMobile ? "14px" : "16px 14px",
                    display: isMobile ? "flex" : "grid",
                    gridTemplateColumns: isMobile ? undefined : "1fr 90px 120px 110px",
                    gap: isMobile ? "12px" : "16px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: isMobile ? "68px" : "80px",
                        height: isMobile ? "84px" : "98px",
                        flexShrink: 0,
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#f5f2ec",
                      }}
                    >
                      {item.image && (
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Link
                        to={`/product/${item.id}`}
                        style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: 600 }}
                      >
                        {item.name}
                      </Link>

                      <button
                        onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                        style={{
                          marginTop: "8px",
                          fontSize: "10px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <X size={9} /> Remove
                      </button>
                    </div>
                  </div>

                  {!isMobile && (
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "14px", fontWeight: 700 }}>
                        {formatPKR(item.price * item.quantity)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div style={{ position: isMobile ? "static" : "sticky", top: "120px" }}>
            <div
              className="border border-cream-300 bg-cream-100"
              style={{ borderRadius: "14px", padding: isMobile ? "20px 16px" : "28px" }}
            >
              <h2 style={{ fontSize: isMobile ? "20px" : "22px", marginBottom: "20px" }}>
                Order Summary
              </h2>

              <div style={{ marginBottom: "20px" }}>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPKR(total)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : formatPKR(shippingCost)}</span>
                </div>

                <hr />

                <div className="flex justify-between">
                  <span>Total</span>
                  <span style={{ fontSize: "20px", fontWeight: 700 }}>
                    {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex justify-between bg-charcoal-900 text-white"
                style={{
                  padding: "14px 20px",
                  borderRadius: "10px",
                  textDecoration: "none",
                }}
              >
                Proceed to Checkout
                <ArrowRight size={13} />
              </Link>

              <p style={{ marginTop: "12px", fontSize: "10px", textAlign: "center" }}>
                <Lock size={9} /> Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag size={22} />
        <h2>Your cart is empty</h2>
        <Link to="/shop">Browse Collection</Link>
      </div>
    </div>
  );
}