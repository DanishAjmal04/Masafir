import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Package,
  MapPin,
  Lock,
  ChevronDown,
  Plus,
  Check,
  ArrowRight,
  LogOut,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { logoutThunk } from "../store/authSlice";
import { authService } from "../services/authService";
import { orderService } from "../services/orderService";

/* ─── helpers ─── */
const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ─── responsive style hook ─── */
function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return mobile;
}

/* ─── tokens ─── */
const T = {
  cream: "#FDFBF7",
  border: "#E5D5BC",
  borderLight: "#F0E8D8",
  charcoal: "#0F0F0E",
  muted: "#3A3A36",
  sand: "#9E7D52",
  activeBg: "#F0E8D8",

  /* ✅ ONLY CHANGE: FONT UPDATED TO FIGTREE */
  fontSerif: "'Figtree', sans-serif",
  fontSans: "'Figtree', sans-serif",
};

/* ─── shared styles ─── */
const s = {
  label: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: T.muted,
    fontWeight: 400,
    marginBottom: "8px",
    fontFamily: T.fontSans,
  },
  input: {
    width: "100%",
    border: `1px solid ${T.border}`,
    background: T.cream,
    padding: "12px 16px",
    fontSize: "13px",
    color: T.charcoal,
    fontFamily: T.fontSans,
    fontWeight: 300,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    borderRadius: "8px",
  },
  btnPrimary: {
    background: T.charcoal,
    color: T.cream,
    border: "none",
    padding: "13px 28px",
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: T.fontSans,
    fontWeight: 300,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "8px",
  },
  btnOutline: {
    background: "none",
    color: T.charcoal,
    border: `1px solid ${T.border}`,
    padding: "13px 28px",
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: T.fontSans,
    fontWeight: 300,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  successBox: {
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    padding: "12px 16px",
    marginBottom: "20px",
    fontSize: "12px",
    color: "#16A34A",
    fontWeight: 300,
    fontFamily: T.fontSans,
    borderRadius: "8px",
  },
  errorBox: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    padding: "12px 16px",
    marginBottom: "20px",
    fontSize: "12px",
    color: "#DC2626",
    fontWeight: 300,
    fontFamily: T.fontSans,
    borderRadius: "8px",
  },
  sectionLabel: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: T.sand,
    fontWeight: 400,
    marginBottom: "8px",
    display: "block",
    fontFamily: T.fontSans,
  },
  sectionTitle: {
    fontFamily: T.fontSerif,
    fontSize: "32px",
    fontWeight: 300,
    color: T.charcoal,
    marginBottom: "28px",
    marginTop: 0,
  },
  divider: { height: "1px", background: T.border, margin: "28px 0" },
  fieldWrap: { marginBottom: "20px" },
  formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" },
};

/* ─── nav items ─── */
const NAV_ITEMS = [
  { key: "profile", label: "My Profile", Icon: User },
  { key: "orders", label: "My Orders", Icon: Package },
  { key: "addresses", label: "Addresses", Icon: MapPin },
  { key: "security", label: "Security", Icon: Lock },
];

/* ══════════════════════════════════════════════════
   AccountPage
══════════════════════════════════════════════════ */
export default function AccountPage() {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [active, setActive] = useState("profile");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await reduxDispatch(logoutThunk());
    navigate("/login");
  };

  const switchTab = (key) => {
    setActive(key);
    setDrawerOpen(false);
  };

  const panels = {
    profile: <ProfilePanel user={user} />,
    orders: <OrdersPanel />,
    addresses: <AddressesPanel />,
    security: <SecurityPanel />,
  };

  const currentLabel = NAV_ITEMS.find((n) => n.key === active)?.label || "Account";

  return (
    <div style={{ minHeight: "100vh", background: T.cream, fontFamily: T.fontSans, paddingTop: "97px" }}>
      {/* ── Mobile top bar ── */}
      {isMobile && (
        <div
          style={{
            position: "sticky",
            top: "97px",
            zIndex: 50,
            background: T.cream,
            borderBottom: `1px solid ${T.border}`,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontFamily: T.fontSerif, fontSize: "18px", fontWeight: 300, color: T.charcoal, margin: 0 }}>
              {currentLabel}
            </p>
            <p style={{ fontSize: "11px", color: T.muted, fontWeight: 300, margin: 0 }}>{user?.email || ""}</p>
          </div>
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "8px", cursor: "pointer", color: T.charcoal, display: "flex", alignItems: "center" }}
            aria-label="Open navigation menu"
          >
            {drawerOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      )}

      {/* ── Mobile drawer ── */}
      {isMobile && drawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            paddingTop: "97px",
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            style={{
              position: "absolute",
              top: "140px",
              left: 0,
              right: 0,
              background: T.cream,
              borderBottom: `1px solid ${T.border}`,
              padding: "12px 20px 20px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  width: "100%",
                  padding: "14px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background: active === key ? T.activeBg : "none",
                  borderLeft: `2px solid ${active === key ? T.charcoal : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: T.fontSans,
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: active === key ? 500 : 300,
                  color: active === key ? T.charcoal : T.muted,
                  textAlign: "left",
                  marginBottom: "2px",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "14px 16px",
                border: "none",
                borderTop: `1px solid ${T.border}`,
                background: "none",
                cursor: "pointer",
                fontFamily: T.fontSans,
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 300,
                color: "#ef4444",
                marginTop: "8px",
                borderRadius: "0 0 8px 8px",
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ── Main layout ── */}
      <div style={{ maxWidth: "1152px", margin: "0 auto", padding: isMobile ? "24px 16px 80px" : "48px 48px 96px" }}>
        {isMobile ? (
          /* Mobile: single column */
          <main>{panels[active]}</main>
        ) : (
          /* Desktop: sidebar + content */
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "48px", alignItems: "start" }}>
            <aside style={{ position: "sticky", top: "120px" }}>
              <div style={{ marginBottom: "28px" }}>
                <p style={{ fontFamily: T.fontSerif, fontSize: "26px", fontWeight: 300, color: T.charcoal, marginBottom: "4px" }}>
                  {user?.first_name || "My Account"}
                </p>
                <p style={{ fontSize: "11px", color: T.muted, fontWeight: 300, letterSpacing: "0.03em" }}>
                  {user?.email || ""}
                </p>
              </div>
              <nav>
                {NAV_ITEMS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 16px",
                      cursor: "pointer",
                      border: "none",
                      background: active === key ? T.activeBg : "none",
                      borderLeft: `2px solid ${active === key ? T.charcoal : "transparent"}`,
                      width: "100%",
                      textAlign: "left",
                      fontFamily: T.fontSans,
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: active === key ? 500 : 300,
                      color: active === key ? T.charcoal : T.muted,
                      transition: "all 0.2s",
                      marginBottom: "2px",
                      borderRadius: "8px",
                    }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    width: "100%",
                    textAlign: "left",
                    fontFamily: T.fontSans,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 300,
                    color: "#ef4444",
                    marginTop: "16px",
                    borderTop: `1px solid ${T.border}`,
                    paddingTop: "20px",
                    borderRadius: "0 0 8px 8px",
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </nav>
            </aside>
            <main>{panels[active]}</main>
          </div>
        )}
      </div>

      {/* ── Mobile bottom tab bar ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: T.cream,
            borderTop: `1px solid ${T.border}`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
          }}
        >
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "10px 4px",
                border: "none",
                background: "none",
                cursor: "pointer",
                borderTop: `2px solid ${active === key ? T.charcoal : "transparent"}`,
                transition: "border-color 0.2s",
              }}
            >
              <Icon size={18} color={active === key ? T.charcoal : T.muted} strokeWidth={active === key ? 1.5 : 1} />
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: active === key ? T.charcoal : T.muted,
                  fontFamily: T.fontSans,
                  fontWeight: active === key ? 500 : 300,
                }}
              >
                {label.split(" ").pop()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Profile Panel
══════════════════════════════════════════════════ */
function ProfilePanel({ user }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    try {
      await authService.updateProfile(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <span style={s.sectionLabel}>Account</span>
      <h2 style={{ ...s.sectionTitle, fontSize: isMobile ? "26px" : "32px" }}>My Profile</h2>
      {success && <div style={s.successBox}>✓ &nbsp; Profile updated successfully.</div>}
      {error && <div style={s.errorBox}>{error}</div>}
      <form onSubmit={handleSave}>
        <div style={isMobile ? {} : s.formGrid2}>
          <div style={isMobile ? s.fieldWrap : {}}>
            <label style={s.label}>First Name</label>
            <input
              style={s.input}
              value={form.first_name}
              onChange={set("first_name")}
              onFocus={(e) => (e.target.style.borderColor = T.charcoal)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>
          <div style={isMobile ? s.fieldWrap : {}}>
            <label style={s.label}>Last Name</label>
            <input
              style={s.input}
              value={form.last_name}
              onChange={set("last_name")}
              onFocus={(e) => (e.target.style.borderColor = T.charcoal)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
          </div>
        </div>
        <div style={s.fieldWrap}>
          <label style={s.label}>Email Address</label>
          <input style={{ ...s.input, background: "#F5F0E8", color: T.muted }} value={user?.email || ""} disabled />
          <p style={{ fontSize: "11px", color: T.muted, marginTop: "5px", fontWeight: 300, fontFamily: T.fontSans }}>
            Email cannot be changed.
          </p>
        </div>
        <div style={s.fieldWrap}>
          <label style={s.label}>Phone Number</label>
          <input
            style={s.input}
            value={form.phone}
            onChange={set("phone")}
            placeholder="03xx-xxxxxxx"
            onFocus={(e) => (e.target.style.borderColor = T.charcoal)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>
        <button type="submit" style={{ ...s.btnPrimary, width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "center" : "flex-start" }} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
          {!loading && <Check size={13} />}
        </button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Orders Panel
══════════════════════════════════════════════════ */
function OrdersPanel() {
  const isMobile = useIsMobile();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const statusColors = {
    pending:    { bg: "#FEF9EE", color: "#B45309" },
    confirmed:  { bg: "#EFF6FF", color: "#1D4ED8" },
    processing: { bg: "#F0F9FF", color: "#0369A1" },
    shipped:    { bg: "#F0FDF4", color: "#15803D" },
    delivered:  { bg: "#F0FDF4", color: "#15803D" },
    cancelled:  { bg: "#FEF2F2", color: "#DC2626" },
    refunded:   { bg: "#F9FAFB", color: "#6B7280" },
  };

  return (
    <div>
      <span style={s.sectionLabel}>History</span>
      <h2 style={{ ...s.sectionTitle, fontSize: isMobile ? "26px" : "32px" }}>My Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <Package size={36} color={T.border} strokeWidth={1} style={{ marginBottom: "16px" }} />
          <p style={{ fontFamily: T.fontSerif, fontSize: "24px", fontWeight: 300, color: T.charcoal, marginBottom: "8px" }}>
            No orders yet
          </p>
          <p style={{ fontSize: "12px", color: T.muted, fontWeight: 300, marginBottom: "24px", fontFamily: T.fontSans }}>
            Your orders will appear here once you've made a purchase.
          </p>
          <Link to="/shop" style={{ ...s.btnPrimary, textDecoration: "none" }}>
            Browse Collection <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        orders.map((order) => {
          const sc = statusColors[order.status] || statusColors.pending;
          const isOpen = openId === order.id;
          return (
            <div
              key={order.id}
              style={{ border: `1px solid ${T.border}`, background: T.cream, marginBottom: "10px", borderRadius: "12px", overflow: "hidden" }}
            >
              {/* Header */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px" : "20px 24px", cursor: "pointer", gap: "12px" }}
                onClick={() => setOpenId(isOpen ? null : order.id)}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 400, color: T.charcoal, letterSpacing: "0.04em", fontFamily: T.fontSans, margin: 0 }}>
                    #{order.order_number}
                  </p>
                  <p style={{ fontSize: "11px", color: T.muted, fontWeight: 300, fontFamily: T.fontSans, margin: "3px 0 0", whiteSpace: "nowrap" }}>
                    {new Date(order.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "14px", flexShrink: 0 }}>
                  <span style={{ background: sc.bg, color: sc.color, fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", fontWeight: 500, fontFamily: T.fontSans, borderRadius: "999px" }}>
                    {order.status}
                  </span>
                  {!isMobile && (
                    <p style={{ fontSize: "14px", fontWeight: 400, color: T.charcoal, fontFamily: T.fontSans, margin: 0 }}>
                      {formatPKR(order.total)}
                    </p>
                  )}
                  <ChevronDown size={15} color={T.muted} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s", flexShrink: 0 }} />
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div style={{ padding: isMobile ? "0 16px 16px" : "0 24px 20px", borderTop: `1px solid ${T.borderLight}` }}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.borderLight}` }}>
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name} style={{ width: "52px", height: "68px", objectFit: "cover", flexShrink: 0, background: T.border, borderRadius: "6px" }} />
                      ) : (
                        <div style={{ width: "52px", height: "68px", flexShrink: 0, background: T.border, borderRadius: "6px" }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", color: T.charcoal, fontWeight: 300, fontFamily: T.fontSans, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.product_name}
                        </p>
                        <p style={{ fontSize: "11px", color: T.muted, fontWeight: 300, fontFamily: T.fontSans, margin: 0 }}>
                          {[item.size && `Size: ${item.size}`, item.color, `Qty: ${item.quantity}`].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <p style={{ fontSize: "13px", color: T.charcoal, fontWeight: 300, fontFamily: T.fontSans, flexShrink: 0 }}>
                        {formatPKR(item.total_price)}
                      </p>
                    </div>
                  ))}

                  <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: "12px" }}>
                    <div>
                      <p style={{ fontSize: "11px", color: T.muted, fontWeight: 300, fontFamily: T.fontSans, margin: "0 0 2px" }}>
                        Shipping:{" "}
                        <span style={{ color: order.shipping_cost === 0 ? T.sand : T.charcoal }}>
                          {order.shipping_cost === 0 ? "Free" : formatPKR(order.shipping_cost)}
                        </span>
                      </p>
                      {order.discount > 0 && (
                        <p style={{ fontSize: "11px", color: "#16A34A", fontWeight: 300, fontFamily: T.fontSans, margin: 0 }}>
                          Discount: -{formatPKR(order.discount)}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: isMobile ? "left" : "right" }}>
                      <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, fontFamily: T.fontSans, marginBottom: "2px", margin: "0 0 2px" }}>
                        Total
                      </p>
                      <p style={{ fontFamily: T.fontSerif, fontSize: "22px", fontWeight: 300, color: T.charcoal, margin: 0 }}>
                        {formatPKR(order.total)}
                      </p>
                    </div>
                  </div>

                  {["pending", "confirmed"].includes(order.status) && (
                    <button
                      style={{ ...s.btnOutline, marginTop: "14px", color: "#ef4444", borderColor: "#FECACA", fontSize: "10px", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "center" : "flex-start" }}
                      onClick={async () => {
                        await orderService.cancelOrder(order.order_number);
                        setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: "cancelled" } : o)));
                      }}
                    >
                      <Trash2 size={12} />
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Addresses Panel
══════════════════════════════════════════════════ */
function AddressesPanel() {
  const isMobile = useIsMobile();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAddr, setEditAddr] = useState(null);
  const [success, setSuccess] = useState("");
  const PROVINCES = ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad", "AJK", "GB"];

  useEffect(() => {
    authService.getAddresses()
      .then((data) => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => authService.getAddresses().then((d) => setAddresses(Array.isArray(d) ? d : []));

  const handleDelete = async (id) => {
    await authService.deleteAddress(id);
    setSuccess("Address deleted.");
    refresh();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleSetDefault = async (id) => {
    await authService.setDefaultAddress(id);
    setSuccess("Default address updated.");
    refresh();
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <span style={s.sectionLabel}>Shipping</span>
      <h2 style={{ ...s.sectionTitle, fontSize: isMobile ? "26px" : "32px" }}>My Addresses</h2>
      {success && <div style={s.successBox}>✓ &nbsp; {success}</div>}

      {!showForm ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "14px" }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                border: `1px solid ${addr.is_default ? T.charcoal : T.border}`,
                padding: "18px",
                position: "relative",
                background: addr.is_default ? "#F9F5EE" : T.cream,
                borderRadius: "10px",
              }}
            >
              {addr.is_default && (
                <span style={{ position: "absolute", top: "12px", right: "12px", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", background: T.charcoal, color: T.cream, padding: "3px 8px", borderRadius: "999px", fontFamily: T.fontSans }}>
                  Default
                </span>
              )}
              <p style={{ fontSize: "13px", fontWeight: 400, color: T.charcoal, fontFamily: T.fontSans, margin: "0 0 4px" }}>{addr.full_name}</p>
              <p style={{ fontSize: "12px", color: T.muted, fontWeight: 300, lineHeight: 1.7, fontFamily: T.fontSans, margin: 0 }}>
                {addr.phone}<br />
                {addr.address_line}<br />
                {addr.city}, {addr.province}
                {addr.postal_code && ` — ${addr.postal_code}`}
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "14px", flexWrap: "wrap" }}>
                <button style={{ fontSize: "11px", color: T.muted, background: "none", border: "none", cursor: "pointer", fontFamily: T.fontSans, textDecoration: "underline", textUnderlineOffset: "2px", padding: 0 }}
                  onClick={() => { setEditAddr(addr); setShowForm(true); }}>
                  Edit
                </button>
                {!addr.is_default && (
                  <button style={{ fontSize: "11px", color: T.muted, background: "none", border: "none", cursor: "pointer", fontFamily: T.fontSans, textDecoration: "underline", textUnderlineOffset: "2px", padding: 0 }}
                    onClick={() => handleSetDefault(addr.id)}>
                    Set Default
                  </button>
                )}
                <button style={{ fontSize: "11px", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: T.fontSans, textDecoration: "underline", textUnderlineOffset: "2px", padding: 0 }}
                  onClick={() => handleDelete(addr.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add address card */}
          <button
            style={{ border: `1px dashed ${T.border}`, borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: "140px", background: "none", gap: "8px", width: "100%", transition: "border-color 0.2s" }}
            onClick={() => { setEditAddr(null); setShowForm(true); }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.charcoal)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
          >
            <Plus size={20} color={T.muted} />
            <span style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: T.muted, fontWeight: 300, fontFamily: T.fontSans }}>
              Add Address
            </span>
          </button>
        </div>
      ) : (
        <AddressForm
          initial={editAddr}
          provinces={PROVINCES}
          onCancel={() => { setShowForm(false); setEditAddr(null); }}
          onSave={async (data) => {
            if (editAddr) {
              await authService.updateAddress(editAddr.id, data);
              setSuccess("Address updated.");
            } else {
              await authService.addAddress(data);
              setSuccess("Address added.");
            }
            setShowForm(false);
            setEditAddr(null);
            refresh();
            setTimeout(() => setSuccess(""), 3000);
          }}
        />
      )}
    </div>
  );
}

function AddressForm({ initial, provinces, onCancel, onSave }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({
    label: initial?.label || "home",
    full_name: initial?.full_name || "",
    phone: initial?.phone || "",
    address_line: initial?.address_line || "",
    city: initial?.city || "",
    province: initial?.province || "",
    postal_code: initial?.postal_code || "",
    is_default: initial?.is_default || false,
  });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(form); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontFamily: T.fontSerif, fontSize: "22px", fontWeight: 300, color: T.charcoal, marginBottom: "24px", marginTop: 0 }}>
        {initial ? "Edit Address" : "New Address"}
      </h3>

      {/* Label pills */}
      <div style={s.fieldWrap}>
        <label style={s.label}>Label</label>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["home", "office", "other"].map((l) => (
            <button key={l} type="button" onClick={() => setForm({ ...form, label: l })}
              style={{ padding: "8px 20px", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", border: `1px solid ${form.label === l ? T.charcoal : T.border}`, background: form.label === l ? T.charcoal : "none", color: form.label === l ? T.cream : T.muted, cursor: "pointer", fontFamily: T.fontSans, fontWeight: 300, borderRadius: "999px" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={isMobile ? {} : s.formGrid2}>
        <div style={isMobile ? s.fieldWrap : {}}>
          <label style={s.label}>Full Name</label>
          <input required style={s.input} value={form.full_name} onChange={set("full_name")}
            onFocus={(e) => (e.target.style.borderColor = T.charcoal)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
        </div>
        <div style={isMobile ? s.fieldWrap : {}}>
          <label style={s.label}>Phone</label>
          <input required style={s.input} value={form.phone} onChange={set("phone")} placeholder="03xx-xxxxxxx"
            onFocus={(e) => (e.target.style.borderColor = T.charcoal)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
        </div>
      </div>

      <div style={s.fieldWrap}>
        <label style={s.label}>Address</label>
        <input required style={s.input} value={form.address_line} onChange={set("address_line")} placeholder="House/Flat, Street, Area"
          onFocus={(e) => (e.target.style.borderColor = T.charcoal)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
      </div>

      <div style={isMobile ? {} : s.formGrid2}>
        <div style={isMobile ? s.fieldWrap : {}}>
          <label style={s.label}>City</label>
          <input required style={s.input} value={form.city} onChange={set("city")}
            onFocus={(e) => (e.target.style.borderColor = T.charcoal)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
        </div>
        <div style={isMobile ? s.fieldWrap : {}}>
          <label style={s.label}>Province</label>
          <select style={{ ...s.input, cursor: "pointer" }} value={form.province} onChange={set("province")}
            onFocus={(e) => (e.target.style.borderColor = T.charcoal)} onBlur={(e) => (e.target.style.borderColor = T.border)}>
            <option value="">Select province</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={s.fieldWrap}>
        <label style={s.label}>Postal Code (Optional)</label>
        <input style={{ ...s.input, maxWidth: isMobile ? "100%" : "200px" }} value={form.postal_code} onChange={set("postal_code")}
          onFocus={(e) => (e.target.style.borderColor = T.charcoal)} onBlur={(e) => (e.target.style.borderColor = T.border)} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <input type="checkbox" id="isDefault" checked={form.is_default}
          onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
          style={{ accentColor: T.charcoal, cursor: "pointer", width: "16px", height: "16px" }} />
        <label htmlFor="isDefault" style={{ fontSize: "12px", color: T.muted, fontWeight: 300, cursor: "pointer", fontFamily: T.fontSans }}>
          Set as default address
        </label>
      </div>

      <div style={{ display: "flex", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
        <button type="submit" style={{ ...s.btnPrimary, justifyContent: "center", flex: isMobile ? 1 : "unset" }} disabled={loading}>
          {loading ? "Saving..." : "Save Address"}
        </button>
        <button type="button" style={{ ...s.btnOutline, justifyContent: "center", flex: isMobile ? 1 : "unset" }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════════════
   Security Panel
══════════════════════════════════════════════════ */
function SecurityPanel() {
  const isMobile = useIsMobile();
  const [form, setForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState({ old_password: false, new_password: false, confirm: false });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.new_password.length < 8) { setError("Minimum 8 characters required."); return; }
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await authService.changePassword({ old_password: form.old_password, new_password: form.new_password });
      setSuccess(true);
      setForm({ old_password: "", new_password: "", confirm: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err?.response?.data?.old_password?.[0] || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const PwField = ({ label, fieldKey, placeholder }) => (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show[fieldKey] ? "text" : "password"}
          placeholder={placeholder}
          value={form[fieldKey]}
          onChange={set(fieldKey)}
          style={{ ...s.input, paddingRight: "56px" }}
          onFocus={(e) => (e.target.style.borderColor = T.charcoal)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        />
        <button
          type="button"
          onClick={() => setShow({ ...show, [fieldKey]: !show[fieldKey] })}
          style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: "11px", fontFamily: T.fontSans, letterSpacing: "0.05em" }}
        >
          {show[fieldKey] ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <span style={s.sectionLabel}>Security</span>
      <h2 style={{ ...s.sectionTitle, fontSize: isMobile ? "26px" : "32px" }}>Change Password</h2>
      {success && <div style={s.successBox}>✓ &nbsp; Password updated successfully.</div>}
      {error && <div style={s.errorBox}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: isMobile ? "100%" : "480px" }}>
        <PwField label="Current Password" fieldKey="old_password" placeholder="••••••••" />
        <div style={s.divider} />
        <PwField label="New Password" fieldKey="new_password" placeholder="Min. 8 characters" />
        <PwField label="Confirm Password" fieldKey="confirm" placeholder="Re-enter new password" />
        <button type="submit" style={{ ...s.btnPrimary, width: isMobile ? "100%" : "auto", justifyContent: "center" }} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
          {!loading && <Check size={13} />}
        </button>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Spinner
══════════════════════════════════════════════════ */
function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <div style={{ width: "24px", height: "24px", border: `1px solid ${T.border}`, borderTop: `1px solid ${T.charcoal}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}