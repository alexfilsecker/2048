import { useState } from "react";
import { Game } from "./components/Game";
import Title from "./components/Title";
import "./styles.css";

function App() {
  const [newGame, setNewGame] = useState(false);

  return (
    <div className="main">
      <Title setNewGame={setNewGame} />
      <Game
        newGame={newGame}
        resetNewGame={() => {
          setNewGame(false);
        }}
      />
    </div>
  );
}

export default App;
