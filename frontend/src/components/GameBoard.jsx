const GameBoard = ({ guesses, currentGuess, maxAttempts, wordLength, gameStatus }) => {
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
    <div className="game-board-container">
      <div className="game-board">
        {/* Render submitted guesses */}
        {guesses.map((guess, i) => (
          <div key={`guess-${i}`}>{renderGuessRow(guess)}</div>
        ))}
        
        {/* Render current guess if game is still active */}
        {gameStatus === 'playing' && guesses.length < maxAttempts && (
          <div key="current">{renderCurrentRow()}</div>
        )}
        
        {/* Render empty rows for remaining attempts */}
        {Array(Math.max(0, maxAttempts - guesses.length - (gameStatus === 'playing' ? 1 : 0))).fill().map((_, i) => (
          <div key={`empty-${i}`}>{renderEmptyRow()}</div>
        ))}
      </div>
      
      {/* Game over overlay */}
      {gameStatus === 'lost' && (
        <div className="game-over-overlay">
          <div className="game-over-message">Game Over</div>
        </div>
      )}
    </div>
  );
};

export default GameBoard; 