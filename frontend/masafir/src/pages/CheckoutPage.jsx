import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingBag,
} from "lucide-react";

import { placeOrderThunk } from "../store/ordersSlice";
import {
  clearCart,
  selectCartTotal,
} from "../store/cartSlice.js";

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const SHIPPING_THRESHOLD = 5000;

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Islamabad",
  "AJK",
  "GB",
];

const PAYMENT_OPTIONS = [
  {
    value: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    desc: "Transfer to our account before dispatch",
    disabled: true,
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    desc: "Secure card payment (coming soon)",
    disabled: true,
  },
];

const s = {
  page: {
    minHeight: "100vh",
    background: "#FDFBF7",
    fontFamily: "'Jost', sans-serif",
    paddingTop: "97px",
    paddingBottom: "96px",
  },

  container: (isMobile) => ({
    maxWidth: "1152px",
    margin: "0 auto",
    padding: isMobile ? "24px 16px 0" : "48px 48px 0",
  }),

  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#3A3A36",
    textDecoration: "none",
    marginBottom: "32px",
  },

  label: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#9E7D52",
    fontWeight: 400,
    marginBottom: "8px",
  },

  heading: (isMobile) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: isMobile ? "32px" : "40px",
    fontWeight: 300,
    color: "#0F0F0E",
    marginBottom: "32px",
    marginTop: 0,
  }),

  layout: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 380px",
    gap: isMobile ? "32px" : "64px",
    alignItems: "start",
  }),

  steps: (isMobile) => ({
    display: "flex",
    alignItems: "center",
    gap: "0",
    marginBottom: "40px",
    overflowX: isMobile ? "auto" : "visible",
    paddingBottom: isMobile ? "10px" : "0",
  }),

  step: (active, done) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: done
      ? "#9E7D52"
      : active
      ? "#0F0F0E"
      : "#C4B8A8",
    fontWeight: active ? 500 : 300,
    whiteSpace: "nowrap",
  }),

  stepNum: (active, done) => ({
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    flexShrink: 0,
    background: done
      ? "#0F0F0E"
      : active
      ? "#0F0F0E"
      : "none",
    color: done || active ? "#FDFBF7" : "#C4B8A8",
    border:
      done || active
        ? "none"
        : "1px solid #C4B8A8",
  }),

  stepLine: {
    flex: 1,
    minWidth: "40px",
    height: "1px",
    background: "#E5D5BC",
    margin: "0 12px",
  },

  formSection: {
    marginBottom: "36px",
  },

  sectionTitle: {
    fontSize: "12px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontWeight: 500,
    color: "#0F0F0E",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #E5D5BC",
  },

  grid2: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "16px",
  }),

  fieldWrap: {
    marginBottom: "16px",
  },

  fieldLabel: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#3A3A36",
    fontWeight: 400,
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    border: "1px solid #E5D5BC",
    background: "#FDFBF7",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#0F0F0E",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: "10px",
  },

  select: {
    width: "100%",
    border: "1px solid #E5D5BC",
    background: "#FDFBF7",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#0F0F0E",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: "10px",
  },

  textarea: {
    width: "100%",
    border: "1px solid #E5D5BC",
    background: "#FDFBF7",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#0F0F0E",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "90px",
    borderRadius: "10px",
  },

  payOption: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "12px",
    border: `1px solid ${active ? "#0F0F0E" : "#E5D5BC"}`,
    background: active ? "#F9F5EE" : "#FDFBF7",
  }),

  payRadio: (active) => ({
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: `2px solid ${active ? "#0F0F0E" : "#C4B8A8"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),

  payDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#0F0F0E",
  },

  payLabel: {
    fontSize: "12px",
    color: "#0F0F0E",
  },

  payDesc: {
    fontSize: "11px",
    color: "#666",
    marginTop: "2px",
  },

  submitBtn: {
    width: "100%",
    background: "#0F0F0E",
    color: "#FDFBF7",
    border: "none",
    padding: "16px",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    borderRadius: "12px",
  },

  summaryBox: (isMobile) => ({
    background: "#F9F5EE",
    border: "1px solid #E5D5BC",
    padding: isMobile ? "22px" : "28px",
    position: isMobile ? "relative" : "sticky",
    top: "120px",
    borderRadius: "16px",
  }),

  summaryTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "24px",
    fontWeight: 300,
    marginBottom: "22px",
    color: "#0F0F0E",
  },

  summaryItem: {
    display: "flex",
    gap: "12px",
    marginBottom: "14px",
    alignItems: "flex-start",
  },

  summaryThumb: {
    width: "52px",
    height: "68px",
    objectFit: "cover",
    background: "#E5D5BC",
    borderRadius: "8px",
    flexShrink: 0,
  },

  summaryItemName: {
    fontSize: "12px",
    color: "#0F0F0E",
    marginBottom: "3px",
  },

  summaryItemSub: {
    fontSize: "11px",
    color: "#666",
  },

  summaryItemPrice: {
    marginLeft: "auto",
    fontSize: "12px",
    color: "#0F0F0E",
    flexShrink: 0,
  },

  summaryDivider: {
    height: "1px",
    background: "#E5D5BC",
    margin: "16px 0",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  summaryKey: {
    fontSize: "11px",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  summaryVal: {
    fontSize: "12px",
    color: "#0F0F0E",
  },

  summaryTotalKey: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    color: "#0F0F0E",
  },

  summaryTotalVal: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    color: "#0F0F0E",
  },
};

// ✅ FIX 1: InputField ko component ke BAHAR define karo
// Andar define karne se har render pe naya component banta tha
// jis ki wajah se focus toot jaata tha
const InputField = ({ name, label, placeholder, type = "text", value, onChange }) => (
  <div style={s.fieldWrap}>
    <label style={s.fieldLabel}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={s.input}
    />
  </div>
);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const { loading, error } = useSelector((s) => s.orders);
  const { user, isAuthenticated } = useSelector((s) => s.auth);

  const shippingCost = total >= SHIPPING_THRESHOLD ? 0 : 350;
  const grandTotal = total + shippingCost;

  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("cod");

  const [form, setForm] = useState({
    shipping_name: user?.full_name || "",
    shipping_phone: user?.phone || "",
    shipping_address: "",
    shipping_city: "",
    shipping_province: "",
    shipping_postal: "",
    guest_email: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((prev) => ({ ...prev, [k]: e.target.value }));

  // ✅ FIX 3: Place Order button handler - step 1 pe step 2 pe jaao
  const handlePlaceOrder = () => {
    if (step === 1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Step 2 pe actual order place karo
    dispatch(placeOrderThunk({ ...form, payment_method: payment }));
  };

  return (
    <div style={s.page}>
      <div style={s.container(isMobile)}>
        <Link to="/cart" style={s.backLink}>
          <ArrowLeft size={12} />
          Back to Cart
        </Link>

        <span style={s.label}>Masafir</span>
        <h1 style={s.heading(isMobile)}>Checkout</h1>

        {/* Steps */}
        <div style={s.steps(isMobile)}>
          <div style={s.step(step === 1, step > 1)}>
            <div style={s.stepNum(step === 1, step > 1)}>
              {step > 1 ? <Check size={11} /> : "1"}
            </div>
            Shipping
          </div>

          <div style={s.stepLine} />

          <div style={s.step(step === 2, step > 2)}>
            <div style={s.stepNum(step === 2, step > 2)}>
              {step > 2 ? <Check size={11} /> : "2"}
            </div>
            Payment
          </div>

          <div style={s.stepLine} />

          <div style={s.step(step === 3, false)}>
            <div style={s.stepNum(step === 3, false)}>3</div>
            Confirm
          </div>
        </div>

        <div style={s.layout(isMobile)}>
          {/* LEFT SIDE */}
          <div>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div style={s.formSection}>
                <p style={s.sectionTitle}>Shipping Information</p>

                {!isAuthenticated && (
                  <InputField
                    name="guest_email"
                    label="Email Address *"
                    placeholder="you@example.com"
                    type="email"
                    value={form.guest_email}
                    onChange={set("guest_email")}
                  />
                )}

                <div style={s.grid2(isMobile)}>
                  <InputField
                    name="shipping_name"
                    label="Full Name *"
                    placeholder="Sara Ahmed"
                    value={form.shipping_name}
                    onChange={set("shipping_name")}
                  />
                  <InputField
                    name="shipping_phone"
                    label="Phone Number *"
                    placeholder="03xx-xxxxxxx"
                    value={form.shipping_phone}
                    onChange={set("shipping_phone")}
                  />
                </div>

                <InputField
                  name="shipping_address"
                  label="Street Address *"
                  placeholder="House no., Street, Area"
                  value={form.shipping_address}
                  onChange={set("shipping_address")}
                />

                <div style={s.grid2(isMobile)}>
                  <InputField
                    name="shipping_city"
                    label="City *"
                    placeholder="Lahore"
                    value={form.shipping_city}
                    onChange={set("shipping_city")}
                  />

                  <div style={s.fieldWrap}>
                    <label style={s.fieldLabel}>Province *</label>
                    <select
                      value={form.shipping_province}
                      onChange={set("shipping_province")}
                      style={s.select}
                    >
                      <option value="">Select province</option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <InputField
                  name="shipping_postal"
                  label="Postal Code"
                  placeholder="54000"
                  value={form.shipping_postal}
                  onChange={set("shipping_postal")}
                />

                <div style={s.fieldWrap}>
                  <label style={s.fieldLabel}>Order Notes</label>
                  <textarea
                    placeholder="Special instructions..."
                    value={form.notes}
                    onChange={set("notes")}
                    style={s.textarea}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div style={s.formSection}>
                <p style={s.sectionTitle}>Payment Method</p>

                {PAYMENT_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    style={{
                      ...s.payOption(payment === opt.value),
                      opacity: opt.disabled ? 0.5 : 1,
                      cursor: opt.disabled ? "not-allowed" : "pointer",
                    }}
                    onClick={() => !opt.disabled && setPayment(opt.value)}
                  >
                    <div style={s.payRadio(payment === opt.value)}>
                      {payment === opt.value && <div style={s.payDot} />}
                    </div>
                    <div>
                      <p style={s.payLabel}>{opt.label}</p>
                      <p style={s.payDesc}>{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button style={s.submitBtn} onClick={handlePlaceOrder}>
              {step === 1 ? "Continue to Payment" : `Place Order — ${formatPKR(grandTotal)}`}
              <ArrowRight size={14} />
            </button>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div>
            <div style={s.summaryBox(isMobile)}>
              <h3 style={s.summaryTitle}>Order Summary</h3>

              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} style={s.summaryItem}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={s.summaryThumb} />
                  ) : (
                    <div style={s.summaryThumb} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={s.summaryItemName}>{item.name}</p>
                    <p style={s.summaryItemSub}>
                      {item.size && `Size: ${item.size}`}
                    </p>
                  </div>
                  <span style={s.summaryItemPrice}>
                    {formatPKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div style={s.summaryDivider} />

              <div style={s.summaryRow}>
                <span style={s.summaryKey}>Subtotal</span>
                <span style={s.summaryVal}>{formatPKR(total)}</span>
              </div>

              <div style={s.summaryRow}>
                <span style={s.summaryKey}>Shipping</span>
                <span style={s.summaryVal}>
                  {shippingCost === 0 ? "Free" : formatPKR(shippingCost)}
                </span>
              </div>

              <div style={s.summaryDivider} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={s.summaryTotalKey}>Total</span>
                <span style={s.summaryTotalVal}>{formatPKR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}