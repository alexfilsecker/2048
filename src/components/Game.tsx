import { useEffect, useState, useRef } from "react";
import { Number } from "./Number";
import { Grid } from "./Grix";
import GameLogic, { Dir } from "../Logic/GameLogic";

type GameObject = {
  value: number;
  row: number;
  col: number;
  key: number;
};

const gameLogic = new GameLogic();

export function Game() {
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [loose, setLoose] = useState(false);

  const swipeRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    setGame();
  }, []);

  function setGame() {
    setGameObjects([...gameLogic.game.flat(2).sort((a, b) => a.key - b.key)]);
  }

  function move(dir: Dir) {
    const changed = gameLogic.moveDir(dir);
    if (changed) {
      setGame();
      setTimeout(() => {
        gameLogic.merge();
        gameLogic.addRandomNumber();
        if (gameLogic.checkLoose()) {
          setLoose(true);
        }
        setGame();
      }, 150);
    }
  }

  useEffect(() => {
    const element = swipeRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyToDir: { [key: string]: Dir } = {
        ArrowDown: Dir.DOWN,
        ArrowUp: Dir.UP,
        ArrowLeft: Dir.LEFT,
        ArrowRight: Dir.RIGHT,
      };
      if (Object.keys(keyToDir).includes(event.key)) {
        let key: string = event.key;
        move(keyToDir[key]);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX.current!;
      const deltaY = touch.clientY - startY.current!;

      let dirSwipe: Dir | null = null;
      if (deltaX > deltaY) {
        if (deltaX > 0) {
          dirSwipe = Dir.RIGHT;
        } else {
          dirSwipe = Dir.LEFT;
        }
      } else {
        if (deltaY > 0) {
          dirSwipe = Dir.DOWN;
        } else {
          dirSwipe = Dir.UP;
        }
      }

      if (dirSwipe !== null) {
        move(dirSwipe);
      }
      startX.current = null;
      startY.current = null;
    };

    document.addEventListener("keydown", handleKeyDown);
    if (element) {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (element) {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      }
    };
  });

  const numbers = gameObjects.map((gameObject) => {
    return (
      <Number
        value={gameObject.value}
        row={gameObject.row}
        col={gameObject.col}
        key={gameObject.key}
      />
    );
  });

  return (
    <div className="grid" ref={swipeRef}>
      <Grid />
      {numbers}
      {loose && (
        <>
          <div className="blur-effect" />
          <div className="win-loose">You Lost!</div>
        </>
      )}
    </div>
  );
}
