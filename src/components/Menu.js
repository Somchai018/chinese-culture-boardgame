import React, { useState } from "react";

export default function Menu({ onStart }) {
  const [numPlayers, setNumPlayers] = useState(2);

  return (
    <div
      style={{
        textAlign: "center",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: 'url("/images/bg_pattern.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Kanit, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#3e2723"
      }}
    >
      {/* โลโก้ */}
      <img
        src="/images/logo.gif"
        alt="เดินทางสู่แดนมังกร"
        style={{
          width: "min(92%, 800px)",
          marginBottom: "40px",
          filter: "drop-shadow(4px 6px 6px rgba(0,0,0,0.3))"
        }}
      />

      {/* กล่อง UI */}
      <div
        style={{
          background: "rgba(255, 248, 230, 0.94)",
          border: "3px solid #f39c12",
          borderRadius: "30px",
          padding: "40px 50px",
          width: "90%",
          maxWidth: "460px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          backdropFilter: "blur(3px)",
          textAlign: "center"
        }}
      >
        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#c0392b",
            marginBottom: "25px"
          }}
        >
          🧧 เลือกจำนวนผู้เล่น
        </div>

        <select
          value={numPlayers}
          onChange={(e) => setNumPlayers(Number(e.target.value))}
          style={{
            fontSize: "1.3rem",
            padding: "12px 22px",
            borderRadius: "14px",
            border: "2px solid #d35400",
            backgroundColor: "#fff8e1",
            fontWeight: "600",
            color: "#6e2c00",
            boxShadow: "inset 0 2px 5px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            outline: "none"
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} คน
            </option>
          ))}
        </select>

        <br />

        <button
          onClick={() => onStart(numPlayers)}
          style={{
            background: "linear-gradient(145deg, #e74c3c, #d35400)",
            color: "#fff",
            padding: "14px 45px",
            border: "none",
            borderRadius: "16px",
            fontSize: "1.4rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
            e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.35)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
          }}
        >
          🎲 เริ่มเล่นเกม
        </button>
      </div>
    </div>
  );
}
