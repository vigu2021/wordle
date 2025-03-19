const GameBoard = ({ guesses, currentGuess, maxAttempts, wordLength }) => {
  // Render a submitted guess row with letter status
  const renderGuessRow = (guess) => {
    return (
      <div className="board-row">
        {guess.map((item, i) => (
          <div key={i} className={`board-tile ${item.status}`}>
            {item.letter}
          </div>
        ))}
      </div>
    );
  };

  // Render the current guess row (being typed)
  const renderCurrentRow = () => {
    const tiles = [];
    
    // Add tiles for letters that have been typed
    for (let i = 0; i < currentGuess.length; i++) {
      tiles.push(
        <div key={i} className="board-tile filled">
          {currentGuess[i]}
        </div>
      );
    }
    
    // Add empty tiles for the rest of the word length
    for (let i = currentGuess.length; i < wordLength; i++) {
      tiles.push(
        <div key={i} className="board-tile"></div>
      );
    }
    
    return <div className="board-row">{tiles}</div>;
  };

  // Render empty rows for remaining attempts
  const renderEmptyRow = () => {
    return (
      <div className="board-row">
        {Array(wordLength).fill().map((_, i) => (
          <div key={i} className="board-tile"></div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-board">
      {/* Render submitted guesses */}
      {guesses.map((guess, i) => (
        <div key={`guess-${i}`}>{renderGuessRow(guess)}</div>
      ))}
      
      {/* Render current guess if game is still active */}
      {guesses.length < maxAttempts && (
        <div key="current">{renderCurrentRow()}</div>
      )}
      
      {/* Render empty rows for remaining attempts */}
      {Array(maxAttempts - guesses.length - 1).fill().map((_, i) => (
        <div key={`empty-${i}`}>{renderEmptyRow()}</div>
      ))}
    </div>
  );
};

export default GameBoard; 