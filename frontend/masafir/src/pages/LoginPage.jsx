import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";

const s = {
  page: {
    minHeight: "100vh",
    background: "#FDFBF7",
    fontFamily: "'Jost', sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  split: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    flex: 1,
    minHeight: "100vh",
  }),

  imageSide: {
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(15,15,14,0.18), rgba(15,15,14,0.56))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "48px",
  },

  imageQuote: (isMobile) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: isMobile ? "24px" : "38px",
    fontWeight: 300,
    color: "#FDFBF7",
    lineHeight: 1.3,
    marginBottom: "12px",
  }),

  imageTagline: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(253,251,247,0.65)",
    fontWeight: 300,
  },

  formSide: (isMobile) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: isMobile ? "40px 20px" : "80px 64px",
    background: "#FDFBF7",
    overflowY: "auto",
  }),

  formInner: {
    width: "100%",
    maxWidth: "460px",
    margin: "0 auto",
  },

  logo: (isMobile) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: isMobile ? "20px" : "24px",
    fontWeight: 300,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "#0F0F0E",
    textDecoration: "none",
    display: "block",
    marginBottom: "40px",
    textAlign: isMobile ? "center" : "left",
  }),

  tabRow: {
    display: "flex",
    borderBottom: "1px solid #E5D5BC",
    marginBottom: "32px",
  },

  tab: (active) => ({
    padding: "12px 0",
    marginRight: "28px",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    fontWeight: 400,
    cursor: "pointer",
    background: "none",
    border: "none",
    borderBottom: active
      ? "2px solid #0F0F0E"
      : "2px solid transparent",
    color: active ? "#0F0F0E" : "#666",
    marginBottom: "-1px",
    transition: "all 0.2s",
  }),

  heading: (isMobile) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: isMobile ? "30px" : "40px",
    fontWeight: 300,
    color: "#0F0F0E",
    marginBottom: "8px",
    marginTop: 0,
  }),

  subtext: {
    fontSize: "13px",
    color: "#555",
    fontWeight: 300,
    marginBottom: "30px",
    lineHeight: 1.7,
  },

  fieldWrap: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#3A3A36",
    fontWeight: 500,
    marginBottom: "8px",
  },

  input: (hasError) => ({
    width: "100%",
    border: `1px solid ${hasError ? "#ef4444" : "#E5D5BC"}`,
    background: "#fff",
    padding: "14px 16px",
    fontSize: "14px",
    color: "#0F0F0E",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: "12px",
    transition: "0.2s",
  }),

  inputWrap: {
    position: "relative",
  },

  eyeBtn: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#666",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },

  errorText: {
    fontSize: "11px",
    color: "#ef4444",
    marginTop: "5px",
  },

  apiError: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    padding: "12px 16px",
    marginBottom: "16px",
    fontSize: "12px",
    color: "#DC2626",
    borderRadius: "10px",
  },

  submitBtn: {
    width: "100%",
    background: "#0F0F0E",
    color: "#FDFBF7",
    border: "none",
    padding: "15px",
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "8px",
    borderRadius: "12px",
    transition: "0.2s",
  },

  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#E5D5BC",
  },

  dividerText: {
    fontSize: "10px",
    color: "#777",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },

  switchText: {
    fontSize: "13px",
    color: "#555",
    textAlign: "center",
    marginTop: "22px",
  },

  switchLink: {
    color: "#0F0F0E",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: "13px",
    textDecoration: "underline",
  },

  row2: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: "12px",
  }),

  checkRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "16px",
    marginTop: "4px",
  },

  checkbox: {
    marginTop: "3px",
    accentColor: "#0F0F0E",
  },

  checkLabel: {
    fontSize: "12px",
    color: "#555",
    lineHeight: 1.6,
  },
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={s.page}>
      <div style={s.split(isMobile)}>
        {!isMobile && (
          <div style={s.imageSide}>
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80"
              alt="Masafir"
              style={s.image}
            />

            <div style={s.imageOverlay}>
              <p style={s.imageQuote(isMobile)}>
                Clothing that travels
                <br />
                as far as you do.
              </p>

              <span style={s.imageTagline}>
                Masafir — Wear the Journey
              </span>
            </div>
          </div>
        )}

        <div style={s.formSide(isMobile)}>
          <div style={s.formInner}>
            <Link to="/" style={s.logo(isMobile)}>
              Masafir
            </Link>

            <div style={s.tabRow}>
              <button
                style={s.tab(activeTab === "login")}
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </button>

              <button
                style={s.tab(activeTab === "register")}
                onClick={() => setActiveTab("register")}
              >
                Create Account
              </button>
            </div>

            {activeTab === "login" ? (
              <LoginForm onSwitch={() => setActiveTab("register")} isMobile={isMobile} />
            ) : (
              <RegisterForm onSwitch={() => setActiveTab("login")} isMobile={isMobile} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= LOGIN ================= */

function LoginForm({ onSwitch, isMobile }) {
  const { login, googleLogin, loading, error } = useAuth();

  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password.trim()) e.password = "Password is required";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});

    await login(form.email, form.password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 style={s.heading(isMobile)}>Welcome back</h1>

      <p style={s.subtext}>
        Sign in to your Masafir account.
      </p>

      {error && (
        <div style={s.apiError}>
          {typeof error === "string"
            ? error
            : "Invalid email or password"}
        </div>
      )}

      <div style={s.fieldWrap}>
        <label style={s.label}>Email</label>

        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={s.input(!!errors.email)}
        />

        {errors.email && (
          <p style={s.errorText}>{errors.email}</p>
        )}
      </div>

      <div style={s.fieldWrap}>
        <label style={s.label}>Password</label>

        <div style={s.inputWrap}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            style={{
              ...s.input(!!errors.password),
              paddingRight: "44px",
            }}
          />

          <button
            type="button"
            style={s.eyeBtn}
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        {errors.password && (
          <p style={s.errorText}>{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...s.submitBtn,
          ...(loading ? s.submitBtnDisabled : {}),
        }}
      >
        {loading ? "Signing In..." : "Sign In"}

        {!loading && <ArrowRight size={14} />}
      </button>

      <div style={s.divider}>
        <div style={s.dividerLine} />
        <span style={s.dividerText}>or</span>
        <div style={s.dividerLine} />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={(res) => googleLogin(res.credential)}
          onError={() => console.log("Google Login Failed")}
        />
      </div>

      <p style={s.switchText}>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          style={s.switchLink}
          onClick={onSwitch}
        >
          Create one
        </button>
      </p>
    </form>
  );
}

/* ================= REGISTER ================= */

function RegisterForm({ onSwitch, isMobile }) {
  const { register, loading, error } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.password) e.password = "Required";

    if (form.password && form.password.length < 8)
      e.password = "Minimum 8 characters";

    if (form.password !== form.password2)
      e.password2 = "Passwords do not match";

    if (!agreed) e.agreed = "Accept terms";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});

    await register(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 style={s.heading(isMobile)}>Create account</h1>

      <p style={s.subtext}>
        Join Masafir today.
      </p>

      {error && (
        <div style={s.apiError}>
          Something went wrong
        </div>
      )}

      <div style={{ ...s.row2(isMobile), marginBottom: "12px" }}>
        <div>
          <label style={s.label}>First Name</label>

          <input
            type="text"
            value={form.first_name}
            onChange={(e) =>
              setForm({
                ...form,
                first_name: e.target.value,
              })
            }
            style={s.input(!!errors.first_name)}
          />

          {errors.first_name && (
            <p style={s.errorText}>
              {errors.first_name}
            </p>
          )}
        </div>

        <div>
          <label style={s.label}>Last Name</label>

          <input
            type="text"
            value={form.last_name}
            onChange={(e) =>
              setForm({
                ...form,
                last_name: e.target.value,
              })
            }
            style={s.input(!!errors.last_name)}
          />

          {errors.last_name && (
            <p style={s.errorText}>
              {errors.last_name}
            </p>
          )}
        </div>
      </div>

      <div style={s.fieldWrap}>
        <label style={s.label}>Email</label>

        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={s.input(!!errors.email)}
        />

        {errors.email && (
          <p style={s.errorText}>{errors.email}</p>
        )}
      </div>

      <div style={s.fieldWrap}>
        <label style={s.label}>Phone (Optional)</label>

        <input
          type="text"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          placeholder="03xx-xxxxxxx"
          style={s.input(false)}
        />
      </div>

      <div style={s.fieldWrap}>
        <label style={s.label}>Password</label>

        <div style={s.inputWrap}>
          <input
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            style={{
              ...s.input(!!errors.password),
              paddingRight: "44px",
            }}
          />

          <button
            type="button"
            style={s.eyeBtn}
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        {errors.password && (
          <p style={s.errorText}>{errors.password}</p>
        )}
      </div>

      <div style={s.fieldWrap}>
        <label style={s.label}>Confirm Password</label>

        <div style={s.inputWrap}>
          <input
            type={showPass2 ? "text" : "password"}
            value={form.password2}
            onChange={(e) =>
              setForm({
                ...form,
                password2: e.target.value,
              })
            }
            style={{
              ...s.input(!!errors.password2),
              paddingRight: "44px",
            }}
          />

          <button
            type="button"
            style={s.eyeBtn}
            onClick={() => setShowPass2(!showPass2)}
          >
            {showPass2 ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        {errors.password2 && (
          <p style={s.errorText}>
            {errors.password2}
          </p>
        )}
      </div>

      <div style={s.checkRow}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={s.checkbox}
        />

        <label style={s.checkLabel}>
          I agree to the Terms & Privacy Policy

          {errors.agreed && (
            <span style={{ color: "#ef4444" }}>
              {" "}
              (required)
            </span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          ...s.submitBtn,
          ...(loading ? s.submitBtnDisabled : {}),
        }}
      >
        {loading ? "Creating..." : "Create Account"}

        {!loading && <ArrowRight size={14} />}
      </button>

      <p style={s.switchText}>
        Already have an account?{" "}
        <button
          type="button"
          style={s.switchLink}
          onClick={onSwitch}
        >
          Sign In
        </button>
      </p>
    </form>
  );
}