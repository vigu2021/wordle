import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import api from './services/api'
import GameBoard from './components/GameBoard'
import Keyboard from './components/Keyboard'
import Message from './components/Message'
import './App.css'

function App() {
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'won', 'lost'
  const [message, setMessage] = useState(null)
  const [keyboardStatus, setKeyboardStatus] = useState({})

  const MAX_ATTEMPTS = 6
  const WORD_LENGTH = 5

  // Initialize a new game
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
    } catch (error) {
      showMessage(error.message, 'error')
    }
  }

  const showMessage = (text, type = 'info', duration = 3000) => {
    setMessage({ text, type })
    
    // Auto-dismiss the message after duration
    setTimeout(() => {
      setMessage(null)
    }, duration)
  }

  const submitGuess = async () => {
    // Validate guess length
    if (currentGuess.length !== WORD_LENGTH) {
      showMessage(`Guess must be ${WORD_LENGTH} letters long`, 'error')
      return
    }

    try {
      const result = await api.checkGuess(currentGuess)
      
      // Add to guesses list
      const newGuesses = [...guesses, result]
      setGuesses(newGuesses)
      setCurrentGuess('')
      
      // Update keyboard status
      const newKeyboardStatus = { ...keyboardStatus }
      result.forEach(({ letter, status }) => {
        // Only update if status is "better" than current
        if (!newKeyboardStatus[letter] || 
            (status === 'correct' || 
             (status === 'present' && newKeyboardStatus[letter] === 'absent'))) {
          newKeyboardStatus[letter] = status
        }
      })
      setKeyboardStatus(newKeyboardStatus)

      // Check win/loss condition
      if (result.every(item => item.status === 'correct')) {
        setGameStatus('won')
        showMessage('Congratulations! You guessed the word!', 'success')
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        setGameStatus('lost')
        try {
          const word = await api.getCurrentWord()
          showMessage(`Game over! The word was: ${word}`, 'error')
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
      {/* New Game button outside the container, always visible */}
      <button className="new-game-btn" onClick={startNewGame}>
        New Game
      </button>
      
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
          />
          
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
