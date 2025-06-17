import React, { useState } from "react";
import Menu from "./components/Menu";
import BoardGame from "./components/BoardGame";

export default function App() {
  const [stage, setStage] = useState("menu");
  const [numPlayers, setNumPlayers] = useState(2);

  function handleStartGame(n) {
    setNumPlayers(n);
    setStage("game");
  }
  function handleRestart() {
    setStage("menu");
  }

  return (
    <div style={{ fontFamily: "Kanit, sans-serif", background: "#f8fafb", minHeight: "100vh" }}>
      {stage === "menu" && <Menu onStart={handleStartGame} />}
      {stage === "game" && <BoardGame numPlayers={numPlayers} onRestart={handleRestart} />}
    </div>
  );
}