from firestore_setup import db

def upload_words_from_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        words = file.read().splitlines()  # Read words line by line

    batch = db.batch()  # Use batch processing to optimize writes
    for word in words:
        doc_ref = db.collection("5-letter-words").document(word.lower())  # Use word as doc ID
        batch.set(doc_ref, {})  # Store an empty document (no need for extra fields)

    batch.commit()  # Commit all writes at once
    print(f"✅ Uploaded {len(words)} words to Firestore!")

if __name__ == "__main__":
    upload_words_from_file("words.txt")




