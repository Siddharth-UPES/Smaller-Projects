# 📝 Word Antakshari Game 🎤 (Node.js + MongoDB)

Welcome to the **Word Antakshari Game** – a classic multiplayer game built using Node.js, MongoDB, and vanilla JavaScript. Players must enter unique words that begin with the **last letter** of the previous word. Compete with others, build your streaks, and climb the leaderboard! 🚀

---

## 🎮 Gameplay Rules

- A player enters a word.
- The next word must **start with the last letter** of the previous word.
- Words **cannot be repeated**.
- Score is calculated based on **word length** and **correct streaks**.
- All valid words and scores are stored in **MongoDB**.

---

## 🚀 Features

✅ **Dynamic Word Handling** – Words are added in real-time.  
✅ **Prevents Repetition** – No repeats allowed!  
✅ **Leaderboard System** – Stores scores and ranks players.  
✅ **Real-time Scoring** – Based on word length and chain.  
✅ **Persistent Database** – MongoDB stores all progress.  
✅ **Lightweight Frontend** – Built with HTML, CSS & JavaScript (jQuery).

---

## 🧰 Tech Stack

| Layer     | Tech Used                           |
|-----------|-------------------------------------|
| Backend   | Node.js, Express.js, Mongoose       |
| Frontend  | HTML, CSS, JavaScript, jQuery       |
| Database  | MongoDB (Local or Atlas)            |
| Tools     | Axios, dotenv, CORS                 |

---

## 📁 Project Structure
Word-Antakshari-Game/ │ ├── models/ # Mongoose Schemas │ └── Word.js │ └── Player.js │ ├── public/ # Frontend Files │ ├── index.html │ ├── style.css │ └── script.js │ ├── .env # Environment Variables ├── server.js # Main Server File ├── package.json # Dependencies └── README.md # Project Info


## 🧪 Sample Flow
 -  Player 1: "Apple" ✅
-  Player 2: "Elephant" ✅
-  Player 3: "Tiger" ✅
-  Player 1: "Rocket" ✅
-  Player 2: "Tank" ✅
-  Player 3: "Kite" ✅
-  Player 1: "Elephant" ❌ Already used!










### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Siddharth-UPES/Smaller-Projects.git
cd "Smaller-Projects/Word-Antakshari Game"

