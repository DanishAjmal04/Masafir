import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react";
import api from "../services/api";

const LINKS = {
  Shop: [
    { label: "New Arrivals", to: "/shop/new" },

    { label: "volume-1 Collections",  to: "/shop/collections" },
    { label: "Sale",         to: "/shop/sale" },
  ],
  Help: [
    { label: "Size Guide",   to: "/size-guide" },
    { label: "Shipping Info",to: "/shipping" },
    { label: "Returns",      to: "/returns" },
    { label: "FAQs",         to: "/faqs" },
    { label: "Contact Us",   to: "/contact" },
  ],
};

const SOCIALS = [
  { Icon: Instagram, href: "https://www.instagram.com/masafirofficial?igsh=NHVmYW9uaDJxcXB6", label: "Instagram" },
  { Icon: Facebook,  href: "https://www.facebook.com/share/17rtYR8r7x/",  label: "Facebook"  },
];

export default function Footer() {
  const [email,    setEmail]    = useState("");
  const [status,   setStatus]   = useState(null); // "success" | "error" | "loading"
  const [message,  setMessage]  = useState("");

  const handleSubscribe = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      await api.post("/newsletter/subscribe/", { email: trimmed });
      setStatus("success");
      setMessage("You're subscribed! Welcome to Masafir.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      const errMsg = err.response?.data?.email?.[0] || err.response?.data?.detail;
      setMessage(errMsg || "Something went wrong. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubscribe();
  };

  return (
    <footer
      style={{
        background:   "#0F0F0E",
        fontFamily:   "'Figtree', sans-serif",
        color:        "#FDFBF7",
        paddingTop:   "clamp(48px, 8vw, 80px)",
        overflowX:    "hidden",
        boxSizing:    "border-box",
        width:        "100%",
      }}
    >
      <div
        style={{
          width:     "100%",
          maxWidth:  "1152px",
          margin:    "0 auto",
          padding:   "0 clamp(16px, 4vw, 48px)",
          boxSizing: "border-box",
        }}
      >
        {/* Main Grid */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap:                 "clamp(24px, 4vw, 48px)",
            paddingBottom:       "clamp(32px, 6vw, 64px)",
            borderBottom:        "1px solid rgba(253,251,247,0.1)",
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: "1 / -1", maxWidth: "340px" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "'Figtree', sans-serif", fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase", color: "#FDFBF7", marginBottom: "12px", display: "block" }}>
                Masafir
              </span>
            </Link>
            <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", fontWeight: 300, marginBottom: "20px", display: "block" }}>
              Heritage in Every Thread
            </span>
            <p style={{ fontSize: "12px", color: "rgba(253,251,247,0.5)", fontWeight: 300, lineHeight: 1.8, margin: "0 0 24px" }}>
              Crafted for those who move through the world with intention. Made in Pakistan with natural fabrics and effortlessly timeless designs.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ width: "36px", height: "36px", border: "1px solid rgba(253,251,247,0.15)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(253,251,247,0.5)", background: "none", textDecoration: "none", transition: "all 0.2s", flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(196,168,130,0.5)"; e.currentTarget.style.color = "#C4A882"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(253,251,247,0.15)"; e.currentTarget.style.color = "rgba(253,251,247,0.5)"; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(253,251,247,0.4)", fontWeight: 500, marginBottom: "16px", display: "block" }}>
                {title}
              </span>
              <ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none", margin: 0, padding: 0 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      style={{ fontSize: "12px", color: "rgba(253,251,247,0.6)", fontWeight: 300, letterSpacing: "0.04em", textDecoration: "none", display: "block", transition: "color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#C4A882"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(253,251,247,0.6)"}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          style={{
            padding:        "clamp(28px, 5vw, 48px) 0",
            borderBottom:   "1px solid rgba(253,251,247,0.1)",
            display:        "flex",
            alignItems:     "flex-start",
            justifyContent: "space-between",
            gap:            "24px",
            flexWrap:       "wrap",
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffffff", fontWeight: 400, marginBottom: "8px", display: "block" }}>
              Stay in the loop
            </span>
            <h3 style={{ fontFamily: "'Figtree', sans-serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 300, color: "#Ffffff", margin: 0, lineHeight: 1.2 }}>
              Join the Masafir<br />community
            </h3>
          </div>

          <div style={{ flex: "1 1 240px", minWidth: 0, maxWidth: "480px" }}>
            <div style={{ display: "flex" }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setStatus(null); setMessage(""); }}
                onKeyDown={handleKeyDown}
                disabled={status === "loading"}
                style={{
                  flex:          1,
                  minWidth:      0,
                  background:    "rgba(253,251,247,0.06)",
                  border:        `1px solid ${status === "error" ? "rgba(239,68,68,0.5)" : "rgba(253,251,247,0.12)"}`,
                  borderRight:   "none",
                  padding:       "12px 16px",
                  fontSize:      "11px",
                  color:         "#FDFBF7",
                  fontFamily:    "'Figtree', sans-serif",
                  fontWeight:    300,
                  letterSpacing: "0.08em",
                  outline:       "none",
                  boxSizing:     "border-box",
                  opacity:       status === "loading" ? 0.6 : 1,
                }}
              />
              <button
                onClick={handleSubscribe}
                disabled={status === "loading"}
                style={{
                  background:  status === "success" ? "#4ade80" : "#ffffff",
                  border:      "none",
                  color:       "#0F0F0E",
                  padding:     "12px 16px",
                  cursor:      status === "loading" ? "not-allowed" : "pointer",
                  display:     "flex",
                  alignItems:  "center",
                  fontFamily:  "'Figtree', sans-serif",
                  flexShrink:  0,
                  transition:  "background 0.3s",
                }}
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Status message */}
            {message && (
              <p style={{
                marginTop:  "8px",
                fontSize:   "11px",
                fontWeight: 300,
                color:      status === "success" ? "#4ade80" : "#f87171",
                lineHeight: 1.5,
              }}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            padding:        "clamp(16px, 3vw, 24px) 0",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "12px",
            flexWrap:       "wrap",
          }}
        >
          <span style={{ fontSize: "11px", color: "rgba(253,251,247,0.3)", fontWeight: 300, letterSpacing: "0.05em" }}>
            © {new Date().getFullYear()} Masafir. All rights reserved.
          </span>

          <div style={{ display: "flex", gap: "clamp(12px, 2vw, 24px)", flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(label => (
              <Link
                key={label}
                to="/"
                style={{ fontSize: "10px", color: "rgba(253,251,247,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 300, textDecoration: "none", whiteSpace: "nowrap" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(253,251,247,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(253,251,247,0.3)"}
              >
                {label}
              </Link>
            ))}
          </div>

          <span style={{ fontSize: "10px", color: "rgba(253,251,247,0.2)", letterSpacing: "0.05em", fontWeight: 300 }}>
            Made in Pakistan ✦
          </span>
        </div>
      </div>
    </footer>
  );
}