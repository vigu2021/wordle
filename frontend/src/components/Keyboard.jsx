const Keyboard = ({ onKeyPress, keyboardStatus }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => {
            const status = keyboardStatus[key] || '';
            const isWide = key === 'Enter' || key === 'Backspace';
            
            return (
              <button
                key={key}
                className={`keyboard-key ${status} ${isWide ? 'wide' : ''}`}
                onClick={() => onKeyPress(key)}
              >
                {key === 'Backspace' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 