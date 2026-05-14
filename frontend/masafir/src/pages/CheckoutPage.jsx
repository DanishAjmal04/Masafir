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
    disabled: true, // ✅ FIXED (disabled)
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    desc: "Secure card payment (coming soon)",
    disabled: true,
  },
];

const s = {
  /* ❌ SAME STYLE OBJECT (UNCHANGED) */
};

// ✅ FIX 1: InputField moved OUTSIDE component (prevents re-mount issue)
const InputField = ({ name, label, placeholder, type = "text", form, set }) => (
  <div style={s.fieldWrap}>
    <label style={s.fieldLabel}>{label}</label>

    <input
      type={type}
      placeholder={placeholder}
      value={form[name]}
      onChange={set(name)}
      style={s.input}
    />
  </div>
);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

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

  const set = (k) => (e) =>
    setForm({
      ...form,
      [k]: e.target.value,
    });

  return (
    <div style={s.page}>
      <div style={s.container(isMobile)}>
        <Link to="/cart" style={s.backLink}>
          <ArrowLeft size={12} />
          Back to Cart
        </Link>

        <span style={s.label}>Masafir</span>

        <h1 style={s.heading(isMobile)}>Checkout</h1>

        {/* STEPS */}
        <div style={s.steps(isMobile)}>
          <div style={s.step(step === 1, step > 1)}>
            <div style={s.stepNum(step === 1, step > 1)}>
              {step > 1 ? <Check size={11} /> : "1"}
            </div>
            Shipping
          </div>

          <div style={s.stepLine} />

          <div style={s.step(step === 2, false)}>
            <div style={s.stepNum(step === 2, false)}>2</div>
            Payment
          </div>

          <div style={s.stepLine} />

          <div style={s.step(false, false)}>
            <div style={s.stepNum(false, false)}>3</div>
            Confirm
          </div>
        </div>

        <div style={s.layout(isMobile)}>
          {/* LEFT */}
          <div>
            <div style={s.formSection}>
              <p style={s.sectionTitle}>Shipping Information</p>

              {!isAuthenticated && (
                <InputField
                  name="guest_email"
                  label="Email Address *"
                  placeholder="you@example.com"
                  type="email"
                  form={form}
                  set={set}
                />
              )}

              <div style={s.grid2(isMobile)}>
                <InputField
                  name="shipping_name"
                  label="Full Name *"
                  placeholder="Sara Ahmed"
                  form={form}
                  set={set}
                />

                <InputField
                  name="shipping_phone"
                  label="Phone Number *"
                  placeholder="03xx-xxxxxxx"
                  form={form}
                  set={set}
                />
              </div>

              <InputField
                name="shipping_address"
                label="Street Address *"
                placeholder="House no., Street, Area"
                form={form}
                set={set}
              />

              <div style={s.grid2(isMobile)}>
                <InputField
                  name="shipping_city"
                  label="City *"
                  placeholder="Lahore"
                  form={form}
                  set={set}
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
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <InputField
                name="shipping_postal"
                label="Postal Code"
                placeholder="54000"
                form={form}
                set={set}
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

            {/* PAYMENT */}
            <div style={s.formSection}>
              <p style={s.sectionTitle}>Payment Method</p>

              {PAYMENT_OPTIONS.map((opt) => {
                if (opt.disabled) return null; // optional: hide disabled options

                return (
                  <div
                    key={opt.value}
                    style={{
                      ...s.payOption(payment === opt.value),
                    }}
                    onClick={() => setPayment(opt.value)}
                  >
                    <div style={s.payRadio(payment === opt.value)}>
                      {payment === opt.value && <div style={s.payDot} />}
                    </div>

                    <div>
                      <p style={s.payLabel}>{opt.label}</p>
                      <p style={s.payDesc}>{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ✅ FIX 3: STEP CHANGE ON BUTTON */}
            <button
              style={s.submitBtn}
              onClick={() => setStep(2)}
            >
              Place Order — {formatPKR(grandTotal)}
              <ArrowRight size={14} />
            </button>
          </div>

          {/* RIGHT SIDE (UNCHANGED) */}
          <div>
            <div style={s.summaryBox(isMobile)}>
              <h3 style={s.summaryTitle}>Order Summary</h3>

              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  style={s.summaryItem}
                >
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

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={s.summaryTotalKey}>Total</span>
                <span style={s.summaryTotalVal}>
                  {formatPKR(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}