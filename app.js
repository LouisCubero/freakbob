let letters = '';
let solutions = [];
let foundWords = [];
let score = 0;

$(document).ready(function() {
    $('#fileInput').on('change', handleFileSelect);
    $('#wordInput').on('keypress', function(e) {
        if (e.which === 13) guessWord();
    });
    $('#guessButton').on('click', guessWord);
    updateDisplay();
});

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        processFileContents(contents);
    };
    reader.readAsText(file);
}

function processFileContents(contents) {
    solutions = contents.trim().split('\n').map(word => word.trim().toUpperCase());
    if (solutions.length > 0) {
        generateUniqueLetters();
        $('#letters').text(`Letters: ${letters}`);
        updateDisplay();
    } else {
        showToast('The file is empty or in an incorrect format.', 'error');
    }
}

function generateUniqueLetters() {
    const allLetters = solutions.join('');
    letters = [...new Set(allLetters)].sort().join('');
}

function guessWord() {
    if (!letters) {
        showToast('Please upload a word list file first.', 'error');
        return;
    }
    const word = $('#wordInput').val().toUpperCase();
    if (!word) return;
    if (!isValidWord(word)) {
        return;
    }
    if (foundWords.includes(word)) {
        showToast('You already found this word. Try another one.', 'warning');
        return;
    }
    foundWords.push(word);
    score++;
    updateDisplay();
    $('#wordInput').val('');
    showToast(`Great! You found "${word}"`, 'success');
}

function isValidWord(word) {
    if (word.length < 2) {
        showToast('The word must be at least 2 letters long.', 'error');
        return false;
    }
    for (let char of word) {
        if (!letters.includes(char)) {
            showToast(`The letter "${char}" is not in the given letters.`, 'error');
            return false;
        }
    }
    if (!solutions.includes(word)) {
        showToast('This word is not in the solution list.', 'error');
        return false;
    }
    return true;
}

function updateDisplay() {
    $('#foundWords').text(`Found Words: ${foundWords.join(', ')}`);
    $('#score').text(`Score: ${score}`);
}

function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: 'center',
        backgroundColor: type === 'error' ? "#ff6b6b" : type === 'warning' ? "#feca57" : "#48dbfb",
    }).showToast();
}