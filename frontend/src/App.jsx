import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import api from './services/api'
import GameBoard from './components/GameBoard'
import Keyboard from './components/Keyboard'
import Message from './components/Message'
import Timer from './components/Timer'
import './App.css'

function App() {
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'won', 'lost'
  const [message, setMessage] = useState(null)
  const [keyboardStatus, setKeyboardStatus] = useState({})
  const [currentWord, setCurrentWord] = useState('') // Store the current word
  const [newGameTrigger, setNewGameTrigger] = useState(0) // Trigger for timer reset

  const MAX_ATTEMPTS = 6
  const WORD_LENGTH = 5

  // Initialize a new game on mount
  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = async () => {
    try {
      await api.startNewGame()
      setGuesses([])
      setCurrentGuess('')
      setGameStatus('playing')
      setMessage(null)
      setKeyboardStatus({})
      setCurrentWord('') // Clear current word
      setNewGameTrigger(prev => prev + 1) // Increment to trigger timer reset
    } catch (error) {
      showMessage(error.message, 'error')
    }
  }

  const showMessage = (text, type = 'info', duration = 3000) => {
    setMessage({ text, type })
    // Auto-dismiss the message after the specified duration
    setTimeout(() => {
      setMessage(null)
    }, duration)
  }

  // When the game ends, fetch the correct word to reveal it.
  useEffect(() => {
    if (gameStatus === 'lost' || gameStatus === 'won') {
      api.getCurrentWord()
        .then(word => {
          setCurrentWord(word.toUpperCase())
        })
        .catch(error => {
          console.error("Could not fetch the word:", error)
        })
    }
  }, [gameStatus])

  const handleTimeUp = () => {
    if (gameStatus === 'playing') {
      setGameStatus('lost')
      showMessage("Time's up! You reached your time limit.", 'error')
      // Fetch and reveal the current word when time is up
      api.getCurrentWord()
        .then(word => {
          setCurrentWord(word.toUpperCase())
        })
        .catch(error => {
          console.error("Could not fetch the word:", error)
        })
    }
  }

  const submitGuess = async () => {
    // Validate guess length
    if (currentGuess.length !== WORD_LENGTH) {
      showMessage(`Guess must be ${WORD_LENGTH} letters long`, 'error')
      return
    }

    try {
      const result = await api.checkGuess(currentGuess)
      
      // Add the result to the list of guesses
      const newGuesses = [...guesses, result]
      setGuesses(newGuesses)
      setCurrentGuess('')

      // Update the keyboard status based on the result
      const newKeyboardStatus = { ...keyboardStatus }
      result.forEach(({ letter, status }) => {
        if (!newKeyboardStatus[letter] || 
            (status === 'correct' || 
             (status === 'present' && newKeyboardStatus[letter] === 'absent'))) {
          newKeyboardStatus[letter] = status
        }
      })
      setKeyboardStatus(newKeyboardStatus)

      // Check win condition
      if (result.every(item => item.status === 'correct')) {
        setGameStatus('won')
        showMessage('Congratulations! You guessed the word!', 'success')
        // Fetch the current word immediately upon winning
        try {
          const word = await api.getCurrentWord()
          setCurrentWord(word.toUpperCase())
        } catch (error) {
          console.error("Could not fetch the word:", error)
        }
      } 
      // Check if maximum attempts have been reached
      else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameStatus('lost')
        try {
          const word = await api.getCurrentWord()
          setCurrentWord(word.toUpperCase())
          showMessage(`Game over! The word was: ${word.toUpperCase()}`, 'error')
        } catch (error) {
          showMessage('Game over! You ran out of guesses.', 'error')
        }
      }
    } catch (error) {
      showMessage(error.message, 'error')
    }
  }

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing') return

    if (key === 'Enter') {
      submitGuess()
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key.toUpperCase())
    }
  }

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing') return
      
      if (e.key === 'Enter') {
        e.preventDefault()
        submitGuess()
      } else if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1))
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentGuess, gameStatus])

  return (
    <>
      {/* New Game button always visible */}
      <button className="new-game-btn" onClick={startNewGame}>
        New Game
      </button>
      
      {/* Timer component */}
      <Timer 
        onTimeUp={handleTimeUp} 
        gameStatus={gameStatus} 
        onNewGame={newGameTrigger}
      />
      
      <div className="app-container">
        <header className="app-header">
          <h1>Wordle Clone</h1>
        </header>
        
        {message && <Message text={message.text} type={message.type} />}
        
        <main className="game-container">
          <GameBoard 
            guesses={guesses} 
            currentGuess={currentGuess} 
            maxAttempts={MAX_ATTEMPTS}
            wordLength={WORD_LENGTH}
            gameStatus={gameStatus}
          />
          
          {/* When the game ends, reveal the word and display an appropriate message */}
          {(gameStatus === 'won' || gameStatus === 'lost') && currentWord && (
            <div className="word-reveal">
              <p className="reveal-label">
                {gameStatus === 'won' 
                  ? `You solved it in ${guesses.length} ${guesses.length === 1 ? 'guess' : 'guesses'}!` 
                  : 'The word was:'}
              </p>
              <p className="reveal-word">{currentWord}</p>
            </div>
          )}
          
          <Keyboard 
            onKeyPress={handleKeyPress} 
            keyboardStatus={keyboardStatus}
          />
        </main>
      </div>
    </>
  )
}

export default App
