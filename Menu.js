import React, { useState } from "react";

export default function Menu({ onStart }) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [showRule, setShowRule] = useState(false);

  return (
    <div
      style={{
        textAlign: "center",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg_pattern.jpg)`,
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
      <img
        src={process.env.PUBLIC_URL + "/images/logo.gif"}
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
        <br />
        <button
          onClick={() => setShowRule(true)}
          style={{
            marginTop: "18px",
            background: "none",
            color: "#b15f05",
            border: "none",
            fontSize: "1.05rem",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          📖 กติกาการเล่น
        </button>
      </div>

      {/* Modal กติกา */}
      {showRule && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(30,16,0,0.28)",
            zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
          onClick={() => setShowRule(false)}
        >
          <div
            style={{
              background: "#fffbe9",
              borderRadius: "50px",
              maxWidth: "98vw",
              width: "420px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
              padding: "36px 26px 26px 26px",
              position: "relative",
              textAlign: "left"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRule(false)}
              style={{
                position: "absolute", top: 18, right: 22,
                fontSize: "1.6rem",
                background: "none",
                border: "none",
                color: "#d35400",
                cursor: "pointer"
              }}
              title="ปิด"
            >✖</button>
            <h2 style={{ color: "#c0392b", marginBottom: 14, fontWeight: 800, fontSize: "1.6rem" }}>กติกาเกม</h2>
            <ol style={{ color: "#6e2c00", fontSize: "1.5rem", marginLeft: "1.2em" }}>
              <li>เลือกจำนวนผู้เล่น (1-6 คน) แล้วกด “เริ่มเล่นเกม”</li>
              <li>แต่ละคนจะผลัดกันทอยลูกเต๋าและเดินตามจำนวนแต้มที่ได้</li>
              <li>เมื่อหยุดที่ช่องพิเศษ อาจได้รับภารกิจ คำถาม หรือโบนัส</li>
              <li>ตอบคำถาม/ทำภารกิจเพื่อสะสมคะแนน ใครได้คะแนนเต็ม100ก่อนเป็นผู้ชนะ!</li>
              <li>เมื่อมีผู้ถึงจุดสิ้นสุด ให้ดูคะแนนและสรุปผล</li>
            </ol>
            <div style={{ textAlign: "right", marginTop: 14 }}>
              <button
                onClick={() => setShowRule(false)}
                style={{
                  background: "linear-gradient(145deg,#e67e22,#e74c3c)",
                  color: "#fff",
                  border: "none",
                  padding: "9px 28px",
                  borderRadius: "12px",
                  fontSize: "1.08rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "6px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.11)"
                }}
              >ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
