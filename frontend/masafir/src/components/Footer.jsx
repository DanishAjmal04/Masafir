import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react";

const f = {
  page: {
    background: "#0F0F0E",
    fontFamily: "'Jost', sans-serif",
    color: "#FDFBF7",
    paddingTop: "80px",
  },
  container: {
    maxWidth: "1152px",
    margin: "0 auto",
    padding: "0 48px",
  },

  // Top section
  top: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
    gap: "48px",
    paddingBottom: "64px",
    borderBottom: "1px solid rgba(253,251,247,0.1)",
  },

  // Brand column
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: 300,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#FDFBF7",
    marginBottom: "16px",
    display: "block",
  },
  brandTagline: {
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(253,251,247,0.4)",
    fontWeight: 300,
    marginBottom: "28px",
    display: "block",
  },
  brandDesc: {
    fontSize: "12px",
    color: "rgba(253,251,247,0.5)",
    fontWeight: 300,
    lineHeight: 1.8,
    maxWidth: "260px",
    marginBottom: "32px",
  },

  // Social icons
  socials: {
    display: "flex",
    gap: "16px",
  },
  socialBtn: {
    width: "36px",
    height: "36px",
    border: "1px solid rgba(253,251,247,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "rgba(253,251,247,0.5)",
    background: "none",
    textDecoration: "none",
    transition: "all 0.2s",
  },

  // Link columns
  colTitle: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(253,251,247,0.4)",
    fontWeight: 500,
    marginBottom: "20px",
    display: "block",
  },
  linkList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  linkItem: {
    fontSize: "12px",
    color: "rgba(253,251,247,0.6)",
    fontWeight: 300,
    letterSpacing: "0.04em",
    textDecoration: "none",
    cursor: "pointer",
    display: "block",
  },

  // Newsletter
  newsletterSection: {
    padding: "48px 0",
    borderBottom: "1px solid rgba(253,251,247,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "48px",
  },
  newsletterLeft: {
    flexShrink: 0,
  },
  newsletterLabel: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#C4A882",
    fontWeight: 400,
    marginBottom: "8px",
    display: "block",
  },
  newsletterHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: 300,
    color: "#FDFBF7",
    margin: 0,
    lineHeight: 1.2,
  },
  newsletterRight: {
    display: "flex",
    flex: 1,
    maxWidth: "480px",
  },
  newsletterInput: {
    flex: 1,
    background: "rgba(253,251,247,0.06)",
    border: "1px solid rgba(253,251,247,0.12)",
    borderRight: "none",
    padding: "13px 18px",
    fontSize: "11px",
    color: "#FDFBF7",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
    letterSpacing: "0.08em",
    outline: "none",
  },
  newsletterBtn: {
    background: "#C4A882",
    border: "1px solid #C4A882",
    color: "#0F0F0E",
    padding: "13px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontFamily: "'Jost', sans-serif",
  },

  // Bottom bar
  bottom: {
    padding: "24px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  copyright: {
    fontSize: "11px",
    color: "rgba(253,251,247,0.3)",
    fontWeight: 300,
    letterSpacing: "0.05em",
  },
  bottomLinks: {
    display: "flex",
    gap: "24px",
  },
  bottomLink: {
    fontSize: "10px",
    color: "rgba(253,251,247,0.3)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontWeight: 300,
    textDecoration: "none",
  },
  badge: {
    fontSize: "10px",
    color: "rgba(253,251,247,0.2)",
    letterSpacing: "0.05em",
    fontWeight: 300,
  },
};

const LINKS = {
  Shop: [
    { label: "New Arrivals",  to: "/shop/new" },
    { label: "Women",         to: "/shop/women" },
    { label: "Men",           to: "/shop/men" },
    { label: "Collections",   to: "/shop/collections" },
    { label: "Sale",          to: "/shop/sale" },
  ],
  Help: [
    { label: "Size Guide",    to: "/size-guide" },
    { label: "Shipping Info", to: "/shipping" },
    { label: "Returns",       to: "/returns" },
    { label: "FAQs",          to: "/faqs" },
    { label: "Contact Us",    to: "/contact" },
  ],
  Company: [
    { label: "Our Story",     to: "/about" },
    { label: "Sustainability", to: "/sustainability" },
    { label: "Careers",       to: "/careers" },
    { label: "Press",         to: "/press" },
    { label: "Stockists",     to: "/stockists" },
  ],
};

const SOCIALS = [
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Facebook,  href: "https://facebook.com",  label: "Facebook"  },
  { Icon: Twitter,   href: "https://twitter.com",   label: "Twitter"   },
  { Icon: Youtube,   href: "https://youtube.com",   label: "YouTube"   },
];

export default function Footer() {
  return (
    <footer style={f.page}>
      <div style={f.container}>

        {/* Main Grid */}
        <div style={f.top}>

          {/* Brand Column */}
          <div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={f.brandName}>Masafir</span>
            </Link>
            <span style={f.brandTagline}>Wear the Journey</span>
            <p style={f.brandDesc}>
              Crafted for those who move through the world with intention. Slow fashion, natural fabrics, and timeless silhouettes — made in Pakistan.
            </p>
            <div style={f.socials}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={f.socialBtn}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(196,168,130,0.5)";
                    e.currentTarget.style.color = "#C4A882";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(253,251,247,0.15)";
                    e.currentTarget.style.color = "rgba(253,251,247,0.5)";
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <span style={f.colTitle}>{title}</span>
              <ul style={f.linkList}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      style={f.linkItem}
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
        <div style={f.newsletterSection}>
          <div style={f.newsletterLeft}>
            <span style={f.newsletterLabel}>Stay in the loop</span>
            <h3 style={f.newsletterHeading}>
              Join the Masafir<br />community
            </h3>
          </div>
          <div style={f.newsletterRight}>
            <input
              type="email"
              placeholder="Your email address"
              style={f.newsletterInput}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(196,168,130,0.4)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(253,251,247,0.12)"}
            />
            <button style={f.newsletterBtn}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={f.bottom}>
          <span style={f.copyright}>
            © {new Date().getFullYear()} Masafir. All rights reserved.
          </span>

          <div style={f.bottomLinks}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((label) => (
              <Link
                key={label}
                to="/"
                style={f.bottomLink}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(253,251,247,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(253,251,247,0.3)"}
              >
                {label}
              </Link>
            ))}
          </div>

          <span style={f.badge}>
            Made in Pakistan ✦
          </span>
        </div>
      </div>
    </footer>
  );
}