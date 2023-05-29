import React, { useEffect, useState, useRef } from "react";
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
  let startX: number = 0;
  let startY: number = 0;

  useEffect(() => {
    setGame();
  }, []);

  function setGame() {
    setGameObjects([...gameLogic.game.flat(2).sort((a, b) => a.key - b.key)]);
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
        const changed = gameLogic.moveDir(keyToDir[key]);
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
    };

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const diffX = event.changedTouches[0].clientX - startX;
      const diffY = event.changedTouches[0].clientY - startY;
      let dirSwipe: Dir;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          dirSwipe = Dir.RIGHT;
        } else {
          dirSwipe = Dir.LEFT;
        }
      } else {
        if (diffY > 0) {
          dirSwipe = Dir.DOWN;
        } else {
          dirSwipe = Dir.UP;
        }
      }
      const changed = gameLogic.moveDir(dirSwipe);
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
