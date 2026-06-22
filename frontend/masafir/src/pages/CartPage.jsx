import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, ArrowRight, ShoppingBag, ArrowLeft, X, Lock, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
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

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

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
            <p className="section-label mb-2" style={{ color: "#1a1a1a" }}>Your Selection</p>
            <h1
              className="text-charcoal-900"
              style={{ fontSize: isMobile ? "28px" : "42px", fontFamily: "'Figtree', sans-serif", fontWeight: 300 }}
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

        

        {/* Layout: stacked on mobile, 2-col on desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
            gap: isMobile ? "24px" : "40px",
            alignItems: "start",
          }}
        >
          {/* ── LEFT: Cart Items ── */}
          <div>
            {/* Table header — hidden on mobile */}
            {!isMobile && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 90px 120px 110px",
                  gap: "16px",
                  padding: "0 8px 12px",
                  borderBottom: "1px solid #e0d9ce",
                  marginBottom: "12px",
                }}
              >
                {["Product", "Size", "Quantity", "Total"].map((h, i) => (
                  <span
                    key={h}
                    className="uppercase text-charcoal-700"
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      fontWeight: 600,
                      textAlign: i === 1 ? "center" : i === 2 ? "center" : i === 3 ? "right" : "left",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Items */}
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
                    flexDirection: isMobile ? "row" : undefined,
                    gap: isMobile ? "12px" : "16px",
                    alignItems: "center",
                  }}
                >
                  {/* Product info */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: isMobile ? 1 : undefined, minWidth: 0 }}>
                    <div
                      style={{
                        width: isMobile ? "68px" : "80px",
                        height: isMobile ? "84px" : "98px",
                        flexShrink: 0,
                        overflow: "hidden",
                        backgroundColor: "#f5f2ec",
                        borderRadius: "8px",
                      }}
                    >
                      {item.image && (
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Link
                        to={`/product/${item.id}`}
                        className="text-charcoal-900 hover:text-charcoal-700 transition-colors duration-200"
                        style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: 600, lineHeight: 1.4, display: "block" }}
                      >
                        {item.name}
                      </Link>

                      {item.color && (
                        <p className="text-charcoal-600 capitalize" style={{ fontSize: "11px", fontWeight: 500, marginTop: "2px" }}>
                          {item.color}
                        </p>
                      )}

                      {/* On mobile: show size + qty + price inline */}
                      {isMobile && (
                        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span
                            className="border border-cream-300 text-charcoal-800"
                            style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, backgroundColor: "#faf9f6", letterSpacing: "0.08em", textTransform: "uppercase" }}
                          >
                            {item.size}
                          </span>

                          <div
                            className="flex items-center border border-cream-300 bg-cream-50"
                            style={{ borderRadius: "8px", overflow: "hidden" }}
                          >
                            <button
                              onClick={() => item.quantity > 1 && dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity - 1 }))}
                              disabled={item.quantity <= 1}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
                              className="text-charcoal-700 disabled:opacity-30"
                            >
                              <Minus size={9} />
                            </button>
                            <span className="text-charcoal-900" style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}
                              style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
                              className="text-charcoal-700"
                            >
                              <Plus size={9} />
                            </button>
                          </div>

                          <span className="text-charcoal-900" style={{ fontSize: "13px", fontWeight: 700 }}>
                            {formatPKR(item.price * item.quantity)}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                        className="text-charcoal-500 hover:text-charcoal-900 transition-colors duration-200 inline-flex items-center gap-1"
                        style={{ marginTop: "8px", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}
                      >
                        <X size={9} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Desktop-only: Size */}
                  {!isMobile && (
                    <div style={{ textAlign: "center" }}>
                      <span
                        className="border border-cream-300 text-charcoal-800"
                        style={{ padding: "5px 12px", textTransform: "uppercase", letterSpacing: "0.1em", borderRadius: "999px", backgroundColor: "#faf9f6", fontSize: "11px", fontWeight: 700 }}
                      >
                        {item.size}
                      </span>
                    </div>
                  )}

                  {/* Desktop-only: Qty */}
                  {!isMobile && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        className="flex items-center border border-cream-300 bg-cream-50"
                        style={{ borderRadius: "9px", overflow: "hidden" }}
                      >
                        <button
                          onClick={() => item.quantity > 1 && dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                          style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
                          className="text-charcoal-700 hover:bg-cream-200 disabled:opacity-30 transition-all"
                        >
                          <Minus size={10} />
                        </button>
                        <span
                          className="text-charcoal-900 border-x border-cream-300"
                          style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700 }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}
                          style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}
                          className="text-charcoal-700 hover:bg-cream-200 transition-all"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Desktop-only: Total */}
                  {!isMobile && (
                    <div style={{ textAlign: "right" }}>
                      <p className="text-charcoal-900" style={{ fontSize: "14px", fontWeight: 700 }}>
                        {formatPKR(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-charcoal-500" style={{ marginTop: "3px", fontSize: "11px", fontWeight: 500 }}>
                          {formatPKR(item.price)} each
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div style={{ position: isMobile ? "static" : "sticky", top: "120px" }}>
            <div
              className="border border-cream-300 bg-cream-100"
              style={{ borderRadius: "14px", padding: isMobile ? "20px 16px" : "28px" }}
            >
              <h2
                className="text-charcoal-900"
                style={{ fontSize: isMobile ? "20px" : "22px", marginBottom: "20px", fontFamily: "'Figtree', sans-serif", fontWeight: 300 }}
              >
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-wide text-charcoal-600 uppercase">
                    Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})
                  </span>
                  <span className="text-sm text-charcoal-900">{formatPKR(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-wide text-charcoal-600 uppercase">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-sm" style={{ color: "#3B6D11" }}>Free</span>
                  ) : (
                    <span className="text-sm text-charcoal-900">{formatPKR(shippingCost)}</span>
                  )}
                </div>
                <div className="bg-cream-300" style={{ height: "1px" }} />
                <div className="flex justify-between items-baseline">
                  <span className="text-xs tracking-widest uppercase text-charcoal-900" style={{ fontWeight: 600 }}>Total</span>
                  <span className="text-charcoal-900" style={{ fontSize: "22px", fontFamily: "'Figtree', sans-serif", fontWeight: 300 }}>
                    {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="flex items-center justify-between w-full bg-charcoal-900 text-cream-50 hover:bg-charcoal-700 transition-all duration-300 group font-light"
                style={{ padding: "14px 20px", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: "10px", textDecoration: "none" }}
              >
                Proceed to Checkout
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <p
                className="text-charcoal-500 font-light flex items-center justify-center gap-1"
                style={{ marginTop: "12px", fontSize: "10px", letterSpacing: "0.05em" }}
              >
                <Lock size={9} /> Secure checkout — SSL encrypted
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

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center" style={{ paddingTop: "80px" }}>
      <div className="text-center px-4">
        <div
          className="border border-cream-300 flex items-center justify-center mx-auto"
          style={{ width: "60px", height: "60px", marginBottom: "24px", borderRadius: "14px" }}
        >
          <ShoppingBag size={22} className="text-charcoal-500" strokeWidth={1} />
        </div>
        <p className="section-label" style={{ marginBottom: "12px", color: "#1a1a1a" }}>Nothing here yet</p>
        <h2
          className="text-charcoal-900"
          style={{ fontSize: isMobile ? "26px" : "34px", marginBottom: "16px", fontFamily: "'Figtree', sans-serif", fontWeight: 300 }}
        >
          Your cart is empty
        </h2>
        <p
          className="text-sm text-charcoal-600 font-light tracking-wide mx-auto"
          style={{ marginBottom: "32px", maxWidth: "300px", lineHeight: 1.7 }}
        >
          Explore our collections and find pieces that move with you.
        </p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-3" style={{ borderRadius: "10px" }}>
          Browse Collection
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}