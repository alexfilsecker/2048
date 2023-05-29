import { useState } from "react";
import { Game } from "./components/Game";
import "./styles.css";

function App() {
  return (
    <div className="main">
      <h1>2048</h1>
      <p>Use the ArrowKeys to move the tiles.</p>
      <Game />
    </div>
  );
}

export default App;
