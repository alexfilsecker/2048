type TitleProps = {
  setNewGame: (_: boolean) => void;
};

const Title = ({ setNewGame }: TitleProps) => {
  return (
    <div className="title-container">
      <h1>2048</h1>
      <button
        onClick={() => {
          setNewGame(true);
        }}
      >
        NEW GAME
      </button>
    </div>
  );
};

export default Title;
