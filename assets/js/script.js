// search for and ADJUST/DELETE all 'NOTE' comments!

// Global Variables
var gameDeck;

// The idea for this piece of code came from the 'Love Maths' project!
document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.getElementsByTagName('button');

    for (let button of buttons) {
        button.addEventListener('click', function () {
            if (this.innerHTML === 'Start!') {
                runGame();
                this.innerHTML = 'Submit Score';
            } else if (this.innerHTML === 'Submit Score') { // NOTE: ADD more 'else if' statements for all buttons on screen!
                let earlySubmit = confirm('Are you sure you wish to terminate game early and submit your score?');
                if (earlySubmit === true) {
                    submitScore();
                } else {
                    console.log('Cancelled');
                }
            }
        })
    }
})

function runGame() {

    startCountdownTimer();
    shuffleDeck();

    // Initial starting hand; 1 card to player, 1 facedown card to dealer, second card to player, second card to dealer (face up).
    drawCardDealer(); // NOTE: make first card hidden!
    drawCardPlayer();
    drawCardDealer();
    drawCardPlayer();

    getImageAltData('dealer-cards');
    getImageAltData('player-cards');

    console.log('Game Running!');
}

/**
 * Deals a card to the dealer
 */
function drawCardDealer() {

    let drawCard = gameDeck.pop();

    let cardImage = document.createElement('img');
    cardImage.src = 'assets/images/' + drawCard + '.png';
    cardImage.alt = `${drawCard}`;

    document.getElementById('dealer-cards').append(cardImage);
}

/**
 * Deals a card to the player, attaches alt attribute to the HTML <img> element according to it's .png name.
 */
function drawCardPlayer() {

    let drawCard = gameDeck.pop();

    let cardImage = document.createElement('img');
    cardImage.src = 'assets/images/' + drawCard + '.png';
    cardImage.alt = `${drawCard}`;

    document.getElementById('player-cards').append(cardImage);
}

/**
 * <img> alt data is stored in an array for later sum calculations.
 */
function getImageAltData(div) {
    let handOfCards = document.getElementById(div);
    let cards = handOfCards.getElementsByTagName('img');

    let arrayOfCardValue = []; // NOTE: remove and place in main runGame function - will plug into cardValue
    for (let i = 0; i < cards.length; i++) {
        let altData = cards[i].alt;
        arrayOfCardValue.push(altData);
    }
    console.log(arrayOfCardValue);
}

let test1 = ['diamonds-ace', 'hearts-ace', 'diamonds-king', 'hearts-queen', 'spades-jack', 'clubs-3']; // should be 55
let test2 = ['clubs-3'];
let test3 = ['diamonds-king'];

function cardValue(array) {
    let value = 0; // NOTE: remove and place in main runGame function
    for (let i = 0; i < array.length; i++) {

        let cardValueString = array[i].split('-');
        console.log(cardValueString);

        if (cardValueString[1] === 'ace') {
            value += 11;
            // https://stackoverflow.com/questions/2363840/how-to-use-or-condition-in-a-javascript-if-statement
            // "Note that if you use string comparisons in the conditions, you need to perform a comparison for each condition..
            // ..otherwise if you only do it in the first one, then it will always return true" - this helped tremendously!
        } else if (cardValueString[1] === 'jack' || cardValueString[1] === 'queen' || cardValueString[1] === 'king') {
            value += 10;
        } else {
            value += parseInt(cardValueString[1]);
        }
    }
    console.log(value);
}

cardValue(test1);

// NOTE: BROKEN
// function cardValue(card) {

//     let hand = document.getElementById('dealer-cards').children.alt;

//     for (let card in hand) {

//     }

//     card.split('-');

//     if (card[1] === 'ace') {
//         return 11;
//     } else if (card[1] === 'jack' || 'queen' || 'king') {
//         return 10;
//     } else {
//         return parseInt(card[1]);
//     }
// }

function submitScore() {

    console.log('Submitting Score');
}

/**
 * Makes and shuffles the deck, ready for play
 */
function shuffleDeck() {

    let suit = ['clubs', 'diamonds', 'hearts', 'spades'];
    let rank = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
    let freshDeck = [];

    // loops through and combines 'suit' and 'rank' arrays; makes an ordered deck of cards.
    for (let s = 0; s < suit.length; s++) {
        for (let r = 0; r < rank.length; r++) {
            freshDeck.push(suit[s] + '-' + rank[r]);
        }
    }

    var shuffledReadyDeck = [];
    // shuffles the ordered deck of cards and pushes it to a new array.
    for (let i = freshDeck.length; i > 0; i--) {

        let randomNumber = Math.floor(Math.random() * i);
        let randomCard = freshDeck.splice(randomNumber, 1);
        shuffledReadyDeck.push(randomCard);
    }

    // updates global gameDeck variable with the shuffled and ready to play deck.
    gameDeck = shuffledReadyDeck;
}

/**
 * Activates a 5 minute timer
 */
function startCountdownTimer() {

    let timer = 300;
    let myInterval = setInterval(countdownTimer, 1000);

    function countdownTimer() {

        if (timer >= 0) {

            const countdownTimer = document.getElementById('countdown-timer');

            let minutes = Math.floor(timer / 60);
            let seconds = timer % 60;

            minutes = minutes < 10 ? '0' + minutes : minutes; // redundant in a 5 minute timer, could have just added a '0' to innerHTML; incase I decide to increase timer.
            seconds = seconds < 10 ? '0' + seconds : seconds;

            countdownTimer.innerHTML = `${minutes} : ${seconds}`;
            timer--;

        } else {

            clearInterval(myInterval);
            console.log('finished'); // NOTE: exchange for code to do endGame functions and leaderboard calculations
            return;
        }
    }
}