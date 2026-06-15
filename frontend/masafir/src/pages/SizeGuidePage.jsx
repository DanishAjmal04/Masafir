import sizechart from "../assets/sizechart.jpeg";
export default function SizeGuidePage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FDFBF7",
      fontFamily: "'Figtree', sans-serif",
      paddingTop: "97px",
      paddingBottom: "80px",
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "48px 24px 0",
      }}>

        <span style={{
          display: "block",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#111111",
          fontWeight: 400,
          marginBottom: "12px",
        }}>
          Masafir
        </span>

        <h1 style={{
          fontFamily: "'Figtree', serif",
          fontSize: "40px",
          fontWeight: 300,
          color: "#0F0F0E",
          margin: "0 0 40px",
        }}>
          Size Guide
        </h1>

        <div style={{
          height: "1px",
          background: "#E5D5BC",
          marginBottom: "48px",
        }} />

        {/* Yahan apni size chart image paste karo */}
        <img
          src={sizechart}
          alt="Masafir Size Guide"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "12px",
          }}
        />

      </div>
    </div>
  );
}