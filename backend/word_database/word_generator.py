
from firestore_setup import db

def upload_words_from_file(file_path, collection_name="5-letter-words", document_name="5-letter-words.json"):
    # Read the text file and convert to a list of words
    with open(file_path, "r", encoding="utf-8") as file:
        words = file.read().splitlines()  # Reads words line by line into a list

    if not words:
        print("❌ No words found in the TXT file.")
        return

    # Convert to JSON format
    words_json = {"words": words}

    # Store in Firestore as a single document
    doc_ref = db.collection("5-letter-words").document(document_name)
    doc_ref.set(words_json)

    print(f"✅ Uploaded {len(words)} words in JSON format to Firestore!")

if __name__ == "__main__":
    upload_words_from_file("words.txt")
