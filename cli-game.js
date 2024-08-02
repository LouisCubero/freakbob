const readline = require('readline');
const fs = require('fs');

// Stores game state
let letters = '';
let solutions = [];
let foundWords = [];
let score = 0;

// Create readline interface for user input/output
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Loads the word list from a file and initializes the game.
 * @param {string} filename - Path to the word list file.
 * @returns {Promise} - Resolves when the file is loaded and processed.
 */
function loadWordList(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            solutions = data.trim().split('\n').map(word => word.trim().toUpperCase());
            generateUniqueLetters();
            resolve();
        });
    });
}

/**
 * Makes unique set of letters from all words in the solution list.
 */
function generateUniqueLetters() {
    const allLetters = solutions.join('');
    letters = [...new Set(allLetters)].sort().join('');
}

/**
 * Checks if a guessed word is valid according to game rules.
 * @param {string} word - The word to validate.
 * @returns {boolean} - True if the word is valid, false otherwise.
 */
function isValidWord(word) {
    if (word.length < 2) {
        console.log('The word must be at least 2 letters long.');
        return false;
    }
    // Iterates through each character in 'word' string
    for (let char of word) {
        if (!letters.includes(char)) {
            console.log(`The letter "${char}" is not in the given letters.`);
            return false;
        }
    }
    if (!solutions.includes(word)) {
        console.log('This word is not in the solution list.');
        return false;
    }
    return true;
}

/**
 * Processes a guessed word, updating score and found words if valid.
 * @param {string} word - The guessed word.
 */
function guessWord(word) {
    word = word.toUpperCase();
    if (!isValidWord(word)) {
        return;
    }
    if (foundWords.includes(word)) {
        console.log('You already found this word. Try another one.');
        return;
    }
    foundWords.push(word);
    score++;
    console.log(`Great! You found "${word}"`);
    console.log(`Score: ${score}`);
    console.log(`Found Words: ${foundWords.join(', ')}`);
}

/**
 * Starts the game loop, prompting for words and handling user input.
 */
function startGame() {
    console.log(`Letters: ${letters}`);
    console.log('Enter a word (or "quit" to exit):');
    rl.on('line', (input) => {
        if (input.toLowerCase() === 'quit') {
            console.log(`Final Score: ${score}`);
            console.log(`Found Words: ${foundWords.join(', ')}`);
            rl.close();
        } else {
            guessWord(input);
            console.log('Enter another word (or "quit" to exit):');
        }
    });
}

// Game initialization
console.log('Welcome to the Word Guessing Game!');
rl.question('Enter the path to your word list file: ', (filename) => {
    loadWordList(filename)
        .then(() => {
            console.log('Word list loaded successfully!');
            startGame();
        })
        .catch((err) => {
            console.error('Error loading word list:', err);
            rl.close();
        });
});