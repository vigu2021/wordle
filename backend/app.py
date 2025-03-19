import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from word_database.firestore_setup import db

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Load words into memory (1 read per 500 words)
def load_words_from_textfile(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        words = file.read().splitlines()  # Read words line by line
    return words



def load_words_into_memory(collection_name):
    collection_ref = db.collection(collection_name)
    docs = list(collection_ref.stream())  # Fetch all words once
    words = [doc.id for doc in docs]  # Store document IDs as words
    return words

# Store words in memory
words = load_words_from_textfile("word_database/words.txt")

# Function to fetch a random word from memory
def get_random_word():
    if not words:
        print("❌ No words in memory!")
        return None
    random_word = random.choice(words)
    print(f"🎲 Random Word: {random_word}")
    return random_word

# Initialize words and select a random word
current_word = get_random_word()
print(f"Current word: {current_word}")  # For debugging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/check', methods=['POST'])
def check_guess():
    if not request.json or 'guess' not in request.json:
        return jsonify({"error": "Missing guess parameter"}), 400
    
    guess = request.json['guess'].lower()
    
    if len(guess) != 5:
        return jsonify({"error": "Guess must be 5 letters"}), 400
    
   
    
    result = []
    
    # Handle correct guess evaluation (track used letters in target word)
    word_copy = list(current_word)
    
    # First pass: check for correct positions
    for i, letter in enumerate(guess):
        if letter == current_word[i]:
            status = "correct"
            if letter in word_copy:
                word_copy.remove(letter)  # Mark this letter as used
        elif letter in word_copy:
            status = "present"
            word_copy.remove(letter)  # Mark this letter as used
        else:
            status = "absent"
        
        result.append({"letter": letter, "status": status})
    
    return jsonify(result)

@app.route('/api/new-game', methods=['GET'])
def new_game():
    global current_word
    current_word = get_random_word()
    print(f"New game! Current word: {current_word}")  # For debugging
    return jsonify({"message": "New game started"})

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Wordle API is running",
        "endpoints": [
            {"path": "/api/check", "method": "POST", "description": "Check a guess"},
            {"path": "/api/new-game", "method": "GET", "description": "Start a new game"}
        ]
    })

# For testing purposes - remove in production
@app.route('/api/word', methods=['GET'])
def get_word():
    return jsonify({"word": current_word})

if __name__ == '__main__':
    print(f"Starting Wordle backend with {len(words)} words in dictionary")
    print(f"Current word: {current_word}")
    app.run(debug=True, host='0.0.0.0', port=5000)
