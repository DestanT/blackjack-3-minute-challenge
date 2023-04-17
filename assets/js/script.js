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
                this.addEventListener('click', function () {
                    let earlySubmit = confirm('Are you sure you wish to terminate game early and submit your score?');
                    if (earlySubmit === true) {
                        // submitScore();
                        turnCardOver();
                        console.log('turn card');
                    } else {
                        console.log('Cancelled');
                    }
                })
            } else {
                console.log('unmapped button')
            }
        })
    }
})

function runGame() {

    startCountdownTimer();
    shuffleDeck();

    // Initial starting hand; 1 card to player, 1 facedown card to dealer, second card to player, second card to dealer (face up).
    turnCardOver(dealCard('dealer-cards'));
    dealCard('player-cards');
    dealCard('dealer-cards');
    dealCard('player-cards');

    let dealerSum = handSum(getImageAltData('dealer-cards'));
    let playerSum = handSum(getImageAltData('player-cards'));

    updateSumHtml('player');

    console.log(dealerSum);
    console.log(playerSum);

    console.log('Game Running!');
}

/**
 * Deals a card to the div specified - use either 'player-cards' or 'dealer-cards'
 */
function dealCard(div) {

    let drawCard = gameDeck.pop();

    let cardImage = document.createElement('img');
    cardImage.src = 'assets/images/' + drawCard + '.png';
    cardImage.alt = `${drawCard}`;

    document.getElementById(div).append(cardImage);
}

/**
 * Turns card over to its back, when re-used turns card over to its front.
 * @returns the altText value for the flipped over card; the function re-uses this value when called again to turn over the same card.
 */
function turnCardOver() {

    let firstCard = document.getElementById('dealer-cards').children[0];
    let altText = firstCard.alt

    if (altText === 'back-of-card') {

        firstCard.remove();

        let flippedCard = document.createElement('img');
        flippedCard.src = 'assets/images/' + storeFirstCard + '.png';
        flippedCard.alt = storeFirstCard;

        document.getElementById('dealer-cards').prepend(flippedCard);

    } else {

        firstCard.remove();

        let flippedCard = document.createElement('img');
        flippedCard.src = 'assets/images/back-of-card.png';
        flippedCard.alt = 'back-of-card';

        document.getElementById('dealer-cards').prepend(flippedCard);

        storeFirstCard = altText;
        return storeFirstCard;
    }
}

/**
 * Input target ID of div; <img> alt data from target is stored in an array for later sum calculations.
 * @returns an array of all cards held in hand (via their altText in HTML).
 */
function getImageAltData(div) {
    let handOfCards = document.getElementById(div);
    let cards = handOfCards.getElementsByTagName('img');

    let arrayOfHand = [];
    for (let i = 0; i < cards.length; i++) {
        let altData = cards[i].alt;
        arrayOfHand.push(altData);
    }

    return arrayOfHand;
}

/**
 * Input arrayOfHand; calculates total sum of hand card values.
 * @returns a total sum of values.
 */
function handSum(array) {

    let value = 0;
    for (let i = 0; i < array.length; i++) {

        let cardValueString = array[i].split('-');

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
    return value;
}

/**
 * Updates the total sum in either the dealer's hand or the player's hand in the HTML (depending on what parameters were chosen).
 * @param {*} who - either 'dealer' or 'player'
 */
function updateSumHtml(who) {

    if (who === 'player') {

        let showSum = document.getElementById('player-sum');
        let totalSum = handSum(getImageAltData('player-cards'));
        showSum.innerHTML = totalSum;

    } else if (who === 'dealer') {

        let showSum = document.getElementById('dealer-sum');
        let totalSum = handSum(getImageAltData('dealer-cards'));
        showSum.innerHTML = totalSum;

    } else {

        throw `${who} not defined. Aborting function!`;
    }
}

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