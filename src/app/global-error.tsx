"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body style={{ background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <button onClick={reset} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "12px 24px", fontSize: "11px" }}>
          Reload
        </button>
      </body>
    </html>
  );
}
