🐾 PetFinder – Lost Pet Identification & User Profile System
FastAPI + Flask AI Model + Expo (React Native) + MySQL (XAMPP)

PetFinder is a full-stack project designed to help users:

Create and update profiles

Report lost pets

Upload pet photos

Use AI-based image similarity to recognize pets

Search for matches using a custom Flask ML model

This README provides complete setup instructions.

🚀 Project Structure
petfinder/
│── backend/
│   ├── main.py (FastAPI)
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── requirements.txt
│── ai/
│   ├── app.py (Flask AI API)
│   ├── embeddings/
│       ├── pet_1.npy
│       ├── pet_2.npy
│── petfrontend/
│   ├── App.js
│   ├── screens/
│   ├── components/
│   ├── package.json

🧠 AI PET RECOGNITION API (Flask)

This service compares a user-uploaded pet photo with known encodings and returns the top matches.

🔍 How it works

User uploads image (multipart/form-data)

Flask receives image → converts to NumPy → extracts features

Compares against stored .npy embeddings

Returns top 3 similar pets

✔ Flask AI Code (app.py)
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

known_encodings = {
    "pet_1": np.load("embeddings/pet_1.npy"),
    "pet_2": np.load("embeddings/pet_2.npy"),
}

def extract_features(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img_resized = cv2.resize(img, (128, 128)) / 255.0
    return img_resized.flatten().reshape(1, -1)

@app.post("/match-pet")
def match_pet():
    if "image" not in request.files:
        return jsonify({"error": "Image required"}), 400

    img = request.files["image"].read()
    input_feat = extract_features(img)

    scores = {}
    for name, known in known_encodings.items():
        sim = cosine_similarity(input_feat, known.reshape(1, -1))[0][0]
        scores[name] = float(sim)

    matches = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    return {"matches": matches[:3]}

if __name__ == "__main__":
    app.run(debug=True)

▶ Run the AI server
cd ai
pip install -r requirements.txt
python app.py


AI runs on:

http://127.0.0.1:5000/match-pet

🐍 FASTAPI BACKEND (MAIN APP)

Handles:

User Profiles (CRUD)

Lost & Found Pets

Authentication (optional)

SQL Database via XAMPP MariaDB

✔ Profile Update Endpoint
@app.put("/profiles/{user_id}", response_model=schemas.ProfileUpdate)
def update_user(user_id: int, user: schemas.ProfileUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.Profile).filter(models.Profile.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

🗄 SQL DATABASE (XAMPP MARIADB)
✔ Create Profiles Table
CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone_number VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  photo_url TEXT
);

✔ Create Lost Pets Table (FK → pet_id)
CREATE TABLE pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(255),
  color VARCHAR(255),
  photo_url TEXT
);

CREATE TABLE lost_pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id INT,
  location VARCHAR(255),
  description TEXT,
  FOREIGN KEY (pet_id) REFERENCES pets(id)
);

📱 EXPO FRONTEND (REACT NATIVE)

Handles:

Profile screen

Update user info

Pick/upload pet images

Call Flask AI match endpoint

✔ Upload image to AI API
const formData = new FormData();
formData.append("image", {
  uri: photoUri,
  name: "pet.jpg",
  type: "image/jpeg",
});

const res = await fetch("http://127.0.0.1:5000/match-pet", {
  method: "POST",
  body: formData,
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

const data = await res.json();
console.log("AI Result:", data);

🧪 TESTING WITH POSTMAN
✔ Update profile
PUT http://127.0.0.1:8000/profiles/1


JSON Body:

{
  "first_name": "John",
  "phone_number": "99999999"
}

✔ AI Testing (image upload)

Use POST → form-data
Key: image → Type: file
Select a pet photo.

🛠 Running the Entire Project
1️⃣ Start Backend (FastAPI)
cd backend
uvicorn main:app --reload

2️⃣ Start AI Server (Flask)
cd ai
python app.py

3️⃣ Start Expo App
cd petfrontend
npm start

🎯 Final Recommendations (Best Practice)

✔ Keep AI model separate (Flask microservice)
✔ Use MySQL (XAMPP) for database
✔ Use Expo for mobile
✔ Store real pet embeddings from CNN models later
✔ Deploy using:

FastAPI → Render / Railway

Flask AI → Docker

Expo → EAS
