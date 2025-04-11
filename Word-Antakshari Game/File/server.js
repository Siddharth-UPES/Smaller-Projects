const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/word_antakshari", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, " MongoDB Connection Error:"));
db.once("open", async () => {
  console.log(" Connected to MongoDB");
  await checkAndImportWords(); // Ensure words are preloaded on startup
});

// Word Schema & Model
const wordSchema = new mongoose.Schema({
  word: { type: String, unique: true },
  length: Number,
});
const Word = mongoose.model("Word", wordSchema);

// Player Schema & Model
const playerSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  score: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
});
const Player = mongoose.model("Player", playerSchema);

// External Word Dictionary
const WORDS_URL = "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt";

// Fetch & Store Words in DB (if empty)
const checkAndImportWords = async () => {
  const count = await Word.countDocuments();
  if (count > 0) {
    console.log(` Database already contains ${count} words. Skipping import.`);
    return;
  }

  console.log(" Fetching words from URL...");
  try {
    const response = await axios.get(WORDS_URL);
    const words = response.data
      .split("\n")
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length > 1);

    console.log(` Total words fetched: ${words.length}`);
    await Word.insertMany(words.map(word => ({ word, length: word.length })));
    console.log(" Words stored successfully in MongoDB!");
  } catch (error) {
    console.error(" Error fetching/storing words:", error);
  }
};

// Get a Random Word from DB
const getRandomWord = async () => {
  const count = await Word.countDocuments();
  if (count === 0) return "hello"; // Default fallback
  const randomIndex = Math.floor(Math.random() * count);
  const word = await Word.findOne().skip(randomIndex);
  return word ? word.word.toUpperCase() : "hello";
};

// Get Next Word Starting with Given Letter
const getNextWord = async (lastLetter) => {
  const words = await Word.find({ word: new RegExp(`^${lastLetter}`, "i") });
  if (words.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].word.toUpperCase();
};

// Current Word Tracker
let currentWord = "";

// Start Game
app.get("/start", async (req, res) => {
  currentWord = await getRandomWord();
  res.json({ word: currentWord });
});

// Play Game - Validate Player's Word & Respond with Next Word
app.post("/play", async (req, res) => {
  const { playerName, word } = req.body;

  if (!word || word[0].toUpperCase() !== currentWord.slice(-1)) {
    return res.status(400).json({
      valid: false,
      message: ` Invalid word! Must start with '${currentWord.slice(-1)}'`,
    });
  }

  const wordExists = await Word.findOne({ word: word.toLowerCase() });
  if (!wordExists) {
    return res.status(400).json({ valid: false, message: " Word not found in dictionary!" });
  }

  // Fetch or Create Player
  let player = await Player.findOne({ name: playerName });
  if (!player) {
    player = new Player({ name: playerName });
  }

  // Update Player Score (Bonus for streaks)
  player.streak += 1;
  player.score += word.length + player.streak * 2;
  await player.save();

  // Fetch Next Word
  const nextWord = await getNextWord(word.slice(-1));
  if (!nextWord) {
    return res.json({
      valid: true,
      message: " You won! No more words left!",
      score: player.score,
    });
  }

  currentWord = nextWord;
  res.json({ valid: true, nextWord: currentWord, score: player.score });
});

// Leaderboard - Top 10 Players
app.get("/leaderboard", async (req, res) => {
  const leaderboard = await Player.find().sort({ score: -1 }).limit(10);
  res.json(leaderboard);
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server running at: http://localhost:${PORT}`);
});
