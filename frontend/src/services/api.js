import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  // Check a guess against the current word
  checkGuess: async (guess) => {
    try {
      const response = await axios.post(`${API_URL}/check`, { guess });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to check guess');
    }
  },

  // Start a new game
  startNewGame: async () => {
    try {
      const response = await axios.get(`${API_URL}/new-game`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to start a new game');
    }
  },

  // Get the current word (for debugging/testing)
  getCurrentWord: async () => {
    try {
      const response = await axios.get(`${API_URL}/word`);
      return response.data.word;
    } catch (error) {
      throw new Error('Failed to get current word');
    }
  }
};

export default api; 