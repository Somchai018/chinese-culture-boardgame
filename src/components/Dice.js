import React, { useEffect, useRef } from "react";
import "./Dice.css";

export default function Dice({ value = 1, rolling = false }) {
  const diceRef = useRef();

  useEffect(() => {
    if (rolling && diceRef.current) {
      diceRef.current.classList.add("rolling");
      const timeout = setTimeout(() => {
        if (diceRef.current) {
          diceRef.current.classList.remove("rolling");
        }
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [rolling, value]);

  const getDiceFace = (val) => {
    switch (val) {
      case 1: return "rotateX(0deg) rotateY(0deg)";
      case 2: return "rotateX(90deg) rotateY(0deg)";
      case 3: return "rotateX(0deg) rotateY(-90deg)";
      case 4: return "rotateX(0deg) rotateY(90deg)";
      case 5: return "rotateX(-90deg) rotateY(0deg)";
      case 6: return "rotateX(180deg) rotateY(0deg)";
      default: return "";
    }
  };

  const renderDots = (positions = []) => {
    return Array(3).fill(0).map((_, row) =>
      Array(3).fill(0).map((_, col) => {
        const key = `${row + 1}-${col + 1}`;
        if (positions.includes(key))
          return <span key={key} className="dot" style={{ gridRow: row + 1, gridColumn: col + 1 }}></span>;
        return null;
      })
    ).flat();
  };

  return (
    <div className="dice-container">
      <div
        className="dice"
        ref={diceRef}
        style={{ transform: getDiceFace(value) }}
      >
        {/* 1 - front */}
        <div className="face front" style={{ display: "grid", gridTemplate: "repeat(3,1fr)/repeat(3,1fr)" }}>
          {renderDots(["2-2"])}
        </div>
        {/* 6 - back */}
        <div className="face back" style={{ display: "grid", gridTemplate: "repeat(3,1fr)/repeat(3,1fr)" }}>
          {renderDots(["1-1", "1-3", "2-1", "2-3", "3-1", "3-3"])}
        </div>
        {/* 3 - right */}
        <div className="face right" style={{ display: "grid", gridTemplate: "repeat(3,1fr)/repeat(3,1fr)" }}>
          {renderDots(["1-1", "2-2", "3-3"])}
        </div>
        {/* 4 - left */}
        <div className="face left" style={{ display: "grid", gridTemplate: "repeat(3,1fr)/repeat(3,1fr)" }}>
          {renderDots(["1-1", "1-3", "3-1", "3-3"])}
        </div>
        {/* 5 - top */}
        <div className="face top" style={{ display: "grid", gridTemplate: "repeat(3,1fr)/repeat(3,1fr)" }}>
          {renderDots(["1-1", "1-3", "2-2", "3-1", "3-3"])}
        </div>
        {/* 2 - bottom */}
        <div className="face bottom" style={{ display: "grid", gridTemplate: "repeat(3,1fr)/repeat(3,1fr)" }}>
          {renderDots(["1-1", "3-3"])}
        </div>
      </div>
    </div>
  );
}
