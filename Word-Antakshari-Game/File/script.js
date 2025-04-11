let currentWord = "";
let playerName = "";
let timeLeft = 15;
let timerInterval;
let playerScore = 0;
let usedWords = []; 

window.onload = function () {
    document.getElementById("name-form").style.display = "block";
    document.getElementById("game-container").style.display = "none";
};

// Start Game after entering the name
function startGame() {
    playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        alert("Please enter your name to start the game.");
        return;
    }
    document.getElementById("name-form").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("player-display").innerText = "Player: " + playerName;
    
    usedWords = []; // Reset used words list on game start

    fetch("/start")
        .then(response => response.json())
        .then(data => {
            currentWord = data.word || "HELLO"; // Default word if API fails
            document.getElementById("current-word").innerText = "Current Word: " + currentWord;
            playerScore = 0;
            document.getElementById("score").innerText = "Score: " + playerScore;
            resetTimer();
        })
        .catch(error => {
            console.error("Error fetching word:", error);
            document.getElementById("current-word").innerText = "Starting with: HELLO";
            currentWord = "HELLO";
            resetTimer();
        });
}

// Submit Word
function submitWord() {
    let newWord = document.getElementById("word-input").value.trim().toUpperCase();

    if (!newWord) {
        document.getElementById("message").innerText = "Please enter a word!";
        return;
    }

    if (usedWords.includes(newWord)) {
        document.getElementById("message").innerText = "Word already used! Try another one.";
        return;
    }

    if (currentWord && newWord[0] !== currentWord.slice(-1)) {
        document.getElementById("message").innerText = `Word must start with '${currentWord.slice(-1)}'!`;
        return;
    }

    fetch("/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName, word: newWord })
    })
    
    .then(response => response.json())
    .then(data => {
        if (data.valid) {
            currentWord = data.nextWord || newWord;
            document.getElementById("current-word").innerText = "Current Word: " + currentWord;
            playerScore += newWord.length; // Score increases with word length
            document.getElementById("score").innerText = "Score: " + playerScore;
            document.getElementById("message").innerText = "Valid word!";
            usedWords.push(newWord);
            resetTimer();
        } else {
            document.getElementById("message").innerText = data.message;
        }
    })
    .catch(error => {
        console.error("Error submitting word:", error);
        document.getElementById("message").innerText = "Accepted! (Offline Mode)";
        currentWord = newWord;
        resetTimer();
    });

    document.getElementById("word-input").value = "";
}

// Reset Timer
function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 15;
    document.getElementById("timer").innerText = "Time Left: " + timeLeft + "s";
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("timer").innerText = "Time Left: " + timeLeft + "s";
        } else {
            clearInterval(timerInterval);
            document.getElementById("message").innerText = "Time's up! You lost this round.";
            document.getElementById("word-input").disabled = true;
            document.querySelector(".submit-btn").disabled = true;
        }
    }, 1000);
}
