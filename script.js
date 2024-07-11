document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://random-word-api.herokuapp.com/word?lang=es';

    let word = '';
    let guessedLetters = [];
    let guessesLeft = 6;

    const wordContainer = document.getElementById('word-container');
    const guessesLeftSpan = document.getElementById('guesses-left');
    const usedLettersSpan = document.getElementById('used-letters');
    const letterInput = document.getElementById('letter-input');
    const guessButton = document.getElementById('guess-button');
    const resultContainer = document.getElementById('result-container');
    const errorContainer = document.getElementById('error-container');

    async function getRandomSpanishWord() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data[0].toUpperCase(); // La API devuelve un array, tomamos el primer elemento
        } catch (error) {
            console.error('Error fetching random word:', error.message);
            errorContainer.textContent = 'Error al cargar la palabra aleatoria. Por favor, intenta de nuevo más tarde.';
        }
    }

    function initializeGame() {
        guessedLetters = [];
        guessesLeft = 6;
        errorContainer.textContent = '';
        resultContainer.textContent = '';
        usedLettersSpan.textContent = '';
        guessesLeftSpan.textContent = guessesLeft;

        getRandomSpanishWord().then(newWord => {
            word = newWord.trim();
            displayWord();
        });
    }

    function displayWord() {
        const wordArray = word.split('');
        const wordHtml = wordArray.map(letter => {
            if (guessedLetters.includes(letter)) {
                return `<span>${letter}</span>`;
            } else {
                return '<span>_</span>';
            }
        }).join('');
        wordContainer.innerHTML = wordHtml;

        checkGameStatus();
    }

    function checkGameStatus() {
        if (word === word.split('').filter(letter => guessedLetters.includes(letter)).join('')) {
            endGame(true);
        } else if (guessesLeft <= 0) {
            endGame(false);
        }
    }

    function endGame(win) {
        if (win) {
            resultContainer.textContent = '¡Felicidades! Has adivinado la palabra correctamente.';
        } else {
            resultContainer.textContent = `¡Oh no! Te has quedado sin intentos. La palabra era: ${word}`;
        }
        letterInput.disabled = true;
        guessButton.disabled = true;
    }

    function handleGuess() {
        const letter = letterInput.value.toUpperCase();
        if (letter && /^[A-Z]$/.test(letter) && !guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
            if (!word.includes(letter)) {
                guessesLeft--;
                guessesLeftSpan.textContent = guessesLeft;
            }
            usedLettersSpan.textContent = guessedLetters.join(', ');

            displayWord();
        }
        letterInput.value = '';
    }

    guessButton.addEventListener('click', handleGuess);

    initializeGame();
});
