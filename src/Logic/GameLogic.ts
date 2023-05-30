type GameObject = {
  value: number;
  row: number;
  col: number;
  key: number;
};

export enum Dir {
  LEFT,
  RIGHT,
  UP,
  DOWN,
}

class GameLogic {
  game: GameObject[][][];
  keyCounter: number;
  score: number;
  latestScore: number;

  constructor() {
    this.game = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => [])
    );
    this.keyCounter = 0;
    this.score = 0;
    this.latestScore = 0;
    this.addRandomNumber();
    this.addRandomNumber();
  }

  findEmptyIndexes(): number[][] {
    const indexes: number[][] = [];
    this.game.forEach((rowList, rowIndex) => {
      rowList.forEach((colList, colIndex) => {
        if (colList.length === 0) {
          indexes.push([rowIndex, colIndex]);
        }
      });
    });
    return indexes;
  }

  checkLoose(): boolean {
    if (this.findEmptyIndexes().length === 0) {
      for (let rowIndex = 0; rowIndex < this.game.length; rowIndex++) {
        for (let colIndex = 0; colIndex < this.game[0].length; colIndex++) {
          const numArr = this.game[rowIndex][colIndex];
          if (numArr.length > 1) {
            return false;
          } else if (numArr.length === 1) {
            let looks: GameObject[][] = [];
            for (let dir = 0; dir < 4; dir++) {
              const seen = this.look(dir as Dir, rowIndex, colIndex);
              if (seen.length > 0) {
                looks.push(seen[0]);
              }
            }
            let flatLooks = looks.flat(1);
            for (
              let neighborIndex = 0;
              neighborIndex < flatLooks.length;
              neighborIndex++
            ) {
              if (flatLooks[neighborIndex].value === numArr[0].value) {
                return false;
              }
            }
          }
        }
      }
      return true;
    }
    return false;
  }

  addRandomNumber() {
    const emptyIndexes: number[][] = this.findEmptyIndexes();
    if (emptyIndexes.length > 0) {
      const [row, col] =
        emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      const value = Math.floor(Math.random() * 2 + 1) * 2;
      const key = this.keyCounter;
      this.keyCounter += 1;
      const newGameObject = { value, row, col, key };
      this.game[row][col] = [...this.game[row][col], newGameObject];
    }
  }

  moveDir(dir: Dir): boolean {
    const gameCopy: GameObject[][][] = JSON.parse(JSON.stringify(this.game));
    switch (dir) {
      case Dir.LEFT:
        for (let colIndex = 0; colIndex < this.game[0].length; colIndex++) {
          for (let rowIndex = 0; rowIndex < this.game.length; rowIndex++) {
            let numArray = this.game[rowIndex][colIndex];
            this.move(rowIndex, colIndex, numArray, dir);
          }
        }
        break;
      case Dir.RIGHT:
        for (
          let colIndex = this.game[0].length - 1;
          colIndex >= 0;
          colIndex--
        ) {
          for (let rowIndex = 0; rowIndex < this.game.length; rowIndex++) {
            let numArray = this.game[rowIndex][colIndex];
            this.move(rowIndex, colIndex, numArray, dir);
          }
        }
        break;
      case Dir.UP:
        for (let rowIndex = 0; rowIndex < this.game.length; rowIndex++) {
          this.game[rowIndex].forEach((numArray, colIndex) => {
            this.move(rowIndex, colIndex, numArray, dir);
          });
        }
        break;
      case Dir.DOWN:
        for (let rowIndex = this.game.length - 1; rowIndex >= 0; rowIndex--) {
          this.game[rowIndex].forEach((numArray, colIndex) => {
            this.move(rowIndex, colIndex, numArray, dir);
          });
        }
        break;
    }
    const changed = !this.checkNoChange(gameCopy);
    return changed;
  }

  checkNoChange(gameCopy: GameObject[][][]): boolean {
    for (let row = 0; row < gameCopy.length; row++) {
      for (let col = 0; col < gameCopy[0].length; col++) {
        if (gameCopy[row][col].length !== this.game[row][col].length) {
          return false;
        }
        for (let inner = 0; inner < gameCopy[row][col].length; inner++) {
          const keyss = Object.keys(gameCopy[row][col][inner]) as Array<
            keyof GameObject
          >;
          for (let i = 0; i < keyss.length; i++) {
            const keyy = keyss[i];
            if (
              gameCopy[row][col][inner][keyy] !==
              this.game[row][col][inner][keyy]
            ) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  move(rowIndex: number, colIndex: number, numArray: GameObject[], dir: Dir) {
    if (numArray.length === 1) {
      let move: number =
        dir === Dir.UP || dir === Dir.DOWN ? rowIndex : colIndex;
      let seen = this.look(dir, rowIndex, colIndex);
      for (let seenIndex = 0; seenIndex < seen.length; seenIndex++) {
        let seenNumArr = seen[seenIndex];
        if (seenNumArr.length === 0) {
          move = this.moveAux(dir, rowIndex, colIndex, seenIndex);
        } else if (seenNumArr.length === 1) {
          if (seenNumArr[0].value === numArray[0].value) {
            move = this.moveAux(dir, rowIndex, colIndex, seenIndex);
          }
          break;
        }
      }
      if (move !== (dir === Dir.UP || dir === Dir.DOWN ? rowIndex : colIndex)) {
        let numToMove = numArray.splice(0, 1)[0];
        if (dir === Dir.UP || dir === Dir.DOWN) {
          numToMove.row = move;
          this.game[move][colIndex].push(numToMove);
        } else {
          numToMove.col = move;
          this.game[rowIndex][move].push(numToMove);
        }
      }
    }
  }

  moveAux(
    dir: Dir,
    rowIndex: number,
    colIndex: number,
    seenIndex: number
  ): number {
    switch (dir) {
      case Dir.LEFT:
        return colIndex - (seenIndex + 1);
      case Dir.RIGHT:
        return colIndex + (seenIndex + 1);
      case Dir.UP:
        return rowIndex - (seenIndex + 1);
      case Dir.DOWN:
        return rowIndex + (seenIndex + 1);
    }
  }

  look(dir: Dir, rowIndex: number, colIndex: number): GameObject[][] {
    const seen: GameObject[][] = [];
    switch (dir) {
      case Dir.LEFT:
        for (let i = colIndex - 1; i >= 0; i--) {
          seen.push(this.game[rowIndex][i]);
        }
        return seen;
      case Dir.RIGHT:
        for (let i = colIndex + 1; i < this.game.length; i++) {
          seen.push(this.game[rowIndex][i]);
        }
        return seen;
      case Dir.UP:
        for (let i = rowIndex - 1; i >= 0; i--) {
          seen.push(this.game[i][colIndex]);
        }
        return seen;
      case Dir.DOWN:
        for (let i = rowIndex + 1; i < this.game.length; i++) {
          seen.push(this.game[i][colIndex]);
        }
        return seen;
    }
  }

  merge() {
    this.latestScore = 0;
    this.game.forEach((row, rowIndex) => {
      row.forEach((numArray, colIndex) => {
        if (numArray.length === 2) {
          if (numArray[0].value === numArray[1].value) {
            let newNum = numArray.splice(0, 2)[0];
            newNum.value = newNum.value * 2;
            this.latestScore += newNum.value;
            newNum.key = this.keyCounter;
            this.keyCounter += 1;
            this.game[rowIndex][colIndex].push(newNum);
          }
        }
      });
    });
    this.score += this.latestScore;
  }
}

export default GameLogic;
