import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react";

const LINKS = {
  Shop: [
    { label: "New Arrivals",   to: "/shop/new"          },
    { label: "Women",          to: "/shop/women"         },
    { label: "Men",            to: "/shop/men"           },
    { label: "Collections",    to: "/shop/collections"   },
    { label: "Sale",           to: "/shop/sale"          },
  ],
  Help: [
    { label: "Size Guide",     to: "/size-guide"         },
    { label: "Shipping Info",  to: "/shipping"           },
    { label: "Returns",        to: "/returns"            },
    { label: "FAQs",           to: "/faqs"               },
    { label: "Contact Us",     to: "/contact"            },
  ],
  Company: [
    { label: "Our Story",      to: "/about"              },
    { label: "Sustainability", to: "/sustainability"     },
    { label: "Careers",        to: "/careers"            },
    { label: "Press",          to: "/press"              },
    { label: "Stockists",      to: "/stockists"          },
  ],
};

const SOCIALS = [
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Facebook,  href: "https://facebook.com",  label: "Facebook"  },
  { Icon: Twitter,   href: "https://twitter.com",   label: "Twitter"   },
  { Icon: Youtube,   href: "https://youtube.com",   label: "YouTube"   },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer style={{
      background:   "#0F0F0E",
      fontFamily:   "'Jost', sans-serif",
      color:        "#FDFBF7",
      paddingTop:   "clamp(48px, 8vw, 80px)",
      // ✅ overflow hidden — koi bhi child bahar nahi jayega
      overflowX:    "hidden",
      boxSizing:    "border-box",
      width:        "100%",
    }}>

      {/* ✅ width:100% + boxSizing + clamp padding */}
      <div style={{
        width:      "100%",
        maxWidth:   "1152px",
        margin:     "0 auto",
        padding:    "0 clamp(16px, 4vw, 48px)",
        boxSizing:  "border-box",
      }}>

        {/* Main Grid — responsive */}
        <div style={{
          display:               "grid",
          // ✅ mobile pe 2 cols, tablet pe 4 — auto-fit se overflow nahi hoga
          gridTemplateColumns:   "repeat(auto-fit, minmax(140px, 1fr))",
          gap:                   "clamp(24px, 4vw, 48px)",
          paddingBottom:         "clamp(32px, 6vw, 64px)",
          borderBottom:          "1px solid rgba(253,251,247,0.1)",
        }}>

          {/* Brand Column */}
          <div style={{ gridColumn: "1 / -1", maxWidth: "340px" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily:    "'Cormorant Garamond', serif",
                fontSize:      "clamp(22px, 4vw, 28px)",
                fontWeight:    300,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color:         "#FDFBF7",
                marginBottom:  "12px",
                display:       "block",
              }}>
                Masafir
              </span>
            </Link>
            <span style={{
              fontSize:      "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color:         "rgba(253,251,247,0.4)",
              fontWeight:    300,
              marginBottom:  "20px",
              display:       "block",
            }}>
              Wear the Journey
            </span>
            <p style={{
              fontSize:     "12px",
              color:        "rgba(253,251,247,0.5)",
              fontWeight:   300,
              lineHeight:   1.8,
              marginBottom: "24px",
              margin:       "0 0 24px",
            }}>
              Crafted for those who move through the world with intention. Slow fashion, natural fabrics, and timeless silhouettes — made in Pakistan.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width:          "36px",
                    height:         "36px",
                    border:         "1px solid rgba(253,251,247,0.15)",
                    borderRadius:   "4px",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    cursor:         "pointer",
                    color:          "rgba(253,251,247,0.5)",
                    background:     "none",
                    textDecoration: "none",
                    transition:     "all 0.2s",
                    flexShrink:     0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(196,168,130,0.5)";
                    e.currentTarget.style.color       = "#C4A882";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(253,251,247,0.15)";
                    e.currentTarget.style.color       = "rgba(253,251,247,0.5)";
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
              <span style={{
                fontSize:      "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color:         "rgba(253,251,247,0.4)",
                fontWeight:    500,
                marginBottom:  "16px",
                display:       "block",
              }}>
                {title}
              </span>
              <ul style={{ display: "flex", flexDirection: "column", gap: "10px", listStyle: "none", margin: 0, padding: 0 }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      style={{
                        fontSize:       "12px",
                        color:          "rgba(253,251,247,0.6)",
                        fontWeight:     300,
                        letterSpacing:  "0.04em",
                        textDecoration: "none",
                        display:        "block",
                        transition:     "color 0.2s",
                      }}
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

        {/* Newsletter — responsive */}
        <div style={{
          padding:        "clamp(28px, 5vw, 48px) 0",
          borderBottom:   "1px solid rgba(253,251,247,0.1)",
          display:        "flex",
          alignItems:     "flex-start",
          justifyContent: "space-between",
          gap:            "24px",
          // ✅ mobile pe column
          flexWrap:       "wrap",
        }}>
          <div style={{ flexShrink: 0 }}>
            <span style={{
              fontSize:      "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         "#C4A882",
              fontWeight:    400,
              marginBottom:  "8px",
              display:       "block",
            }}>
              Stay in the loop
            </span>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize:   "clamp(20px, 3vw, 28px)",
              fontWeight: 300,
              color:      "#FDFBF7",
              margin:     0,
              lineHeight: 1.2,
            }}>
              Join the Masafir<br />community
            </h3>
          </div>

          {/* ✅ flex: 1 + minWidth: 0 — shrink hoga overflow nahi karega */}
          <div style={{
            display:   "flex",
            flex:      "1 1 240px",
            minWidth:  0,
            maxWidth:  "480px",
          }}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex:          1,
                minWidth:      0,       // ✅ zaroori — input shrink ho sake
                background:    "rgba(253,251,247,0.06)",
                border:        "1px solid rgba(253,251,247,0.12)",
                borderRight:   "none",
                padding:       "12px 16px",
                fontSize:      "11px",
                color:         "#FDFBF7",
                fontFamily:    "'Jost', sans-serif",
                fontWeight:    300,
                letterSpacing: "0.08em",
                outline:       "none",
                boxSizing:     "border-box",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(196,168,130,0.4)"}
              onBlur={e  => e.currentTarget.style.borderColor = "rgba(253,251,247,0.12)"}
            />
            <button style={{
              background:  "#C4A882",
              border:      "1px solid #C4A882",
              color:       "#0F0F0E",
              padding:     "12px 16px",
              cursor:      "pointer",
              display:     "flex",
              alignItems:  "center",
              fontFamily:  "'Jost', sans-serif",
              flexShrink:  0,
            }}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Bar — responsive */}
        <div style={{
          padding:        "clamp(16px, 3vw, 24px) 0",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            "12px",
          flexWrap:       "wrap",   // ✅ mobile pe wrap hoga
        }}>
          <span style={{
            fontSize:      "11px",
            color:         "rgba(253,251,247,0.3)",
            fontWeight:    300,
            letterSpacing: "0.05em",
          }}>
            © {new Date().getFullYear()} Masafir. All rights reserved.
          </span>

          <div style={{
            display:  "flex",
            gap:      "clamp(12px, 2vw, 24px)",
            flexWrap: "wrap",
          }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(label => (
              <Link
                key={label}
                to="/"
                style={{
                  fontSize:       "10px",
                  color:          "rgba(253,251,247,0.3)",
                  letterSpacing:  "0.1em",
                  textTransform:  "uppercase",
                  fontWeight:     300,
                  textDecoration: "none",
                  whiteSpace:     "nowrap",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(253,251,247,0.6)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(253,251,247,0.3)"}
              >
                {label}
              </Link>
            ))}
          </div>

          <span style={{
            fontSize:      "10px",
            color:         "rgba(253,251,247,0.2)",
            letterSpacing: "0.05em",
            fontWeight:    300,
          }}>
            Made in Pakistan ✦
          </span>
        </div>
      </div>
    </footer>
  );
}