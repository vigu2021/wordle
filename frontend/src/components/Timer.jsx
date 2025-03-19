import React, { useState, useEffect, useRef } from 'react';
import './Timer.css'; // Add styles here

const Timer = ({ onTimeUp, gameStatus, onNewGame }) => {
  const [time, setTime] = useState(0); // Count up from 0 seconds
  const [isVisible, setIsVisible] = useState(true); // Toggle visibility
  const [timeLimit, setTimeLimit] = useState(null); // No time limit by default
  const [showLimitInput, setShowLimitInput] = useState(false);
  const inputRef = useRef(null);
  
  // Reset timer only on new game, not on each guess
  useEffect(() => {
    if (onNewGame) {
      setTime(0);
    }
  }, [onNewGame]);

  // Timer logic
  useEffect(() => {
    // Check if time limit is reached
    if (timeLimit && time >= timeLimit) {
      onTimeUp();
      return;
    }

    // Only count if the game is in playing state
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [time, onTimeUp, gameStatus, timeLimit]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle time limit setting
  const handleSetTimeLimit = () => {
    const newLimit = parseInt(inputRef.current.value, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      setTimeLimit(newLimit);
      setShowLimitInput(false);
    }
  };

  // Handle Enter key in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSetTimeLimit();
    }
  };

  // Clear time limit
  const handleClearLimit = () => {
    setTimeLimit(null);
  };

  return (
    <div className={`timer-container ${isVisible ? 'show' : 'hide'}`}>
      <div className="timer">
        ⏱️ {formatTime(time)} 
        {timeLimit && <span className="limit-indicator">/{formatTime(timeLimit)}</span>}
      </div>
      
      <div className="timer-controls">
        {!showLimitInput ? (
          <>
            <button className="timer-btn" onClick={() => setShowLimitInput(true)}>
              {timeLimit ? 'Change Limit' : 'Set Limit'}
            </button>
            {timeLimit && 
              <button className="timer-btn clear" onClick={handleClearLimit}>
                Clear Limit
              </button>
            }
          </>
        ) : (
          <div className="limit-input-container">
            <input 
              ref={inputRef}
              type="number" 
              className="limit-input" 
              placeholder="Seconds" 
              defaultValue={timeLimit || ""}
              onKeyDown={handleKeyDown}
            />
            <button className="timer-btn small" onClick={handleSetTimeLimit}>Set</button>
            <button className="timer-btn small" onClick={() => setShowLimitInput(false)}>Cancel</button>
          </div>
        )}
        
        <button className="toggle-btn" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
};

export default Timer;
