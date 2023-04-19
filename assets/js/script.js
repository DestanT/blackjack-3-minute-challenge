// search for and ADJUST/DELETE all 'NOTE' comments!
// add sound:
// - bust-hand
// - poker-chip-single
// - poker-chip-winnings

// add effects:
// - cards moving from draw deck to player + dealer
// - chips moving to bet stack and back

// add split function
// hide all buttons until 'start' is pressed
// remaining cards in deck - shuffle function at certain cards left
// continue play after first hand finishes - incorporate timer!

// stack cards on top of eachother in mobile and tablet view - CSS
// CSS - for media query 768 and below - leaderboard and game rules is hidden - display in elsewhere!

// Global Variables
var gameDeck;

// Sound Effects:
const soundDealSingle = document.getElementById('deal-single');
const soundFlipCard = document.getElementById('flip-card');
const soundWinHand = document.getElementById('win-hand');
const soundLoseHand = document.getElementById('lose-hand');
const soundShuffleDeck = document.getElementById('shuffle-deck');

// The idea for this piece of code came from the 'Love Maths' project!
document.addEventListener('DOMContentLoaded', function() {

    addEventHandlers();
    // toggleDisplayButtons();
})

function addEventHandlers() {

    let startButton = document.getElementById('start');
    startButton.addEventListener('pointerdown', runGame);

    let hitButton = document.getElementById('hit');
    hitButton.addEventListener('pointerdown', hit);
    
    let splitButton = document.getElementById('split');
    splitButton.addEventListener('pointerdown', );
    
    let standButton = document.getElementById('stand');
    standButton.addEventListener('pointerdown', dealersTurn);
}

function runGame() {

    startCountdownTimer();
    shuffleDeck();

    // Initial starting hand; 1 card to player, 1 facedown card to dealer, second card to player, second card to dealer (face up).
    turnCardOver(dealCard('dealer-cards'));
    dealCard('player-cards');
    dealCard('dealer-cards');
    dealCard('player-cards');

    let dealerHand = handValues(getImageAltData('dealer-cards'));
    let playerHand = handValues(getImageAltData('player-cards'));

    updateSumHtml('player');
    updateSumHtml('dealer');

    console.log(dealerHand.value);
    console.log(playerHand.value);

    console.log('Game Running!');
}

/**
 * Deals a card to the div specified - use either 'player-cards' or 'dealer-cards'
 */
function dealCard(div) {

    soundDealSingle.play();
    
    let drawCard = gameDeck.pop();
    
    let cardImage = document.createElement('img');
    cardImage.src = 'assets/images/' + drawCard + '.png';
    cardImage.alt = `${drawCard}`;
    
    document.getElementById(div).append(cardImage);

    // Counts the amount of images in hand of ('div') and if it is more than 4; stacks the cards for easier viewing.
    let htmlDiv = document.getElementById(div);
    let images = htmlDiv.getElementsByTagName('img');
    numberOfImages = images.length;
    
    console.log(numberOfImages);
    console.log(images[0]);

    if (numberOfImages >= 4) {
        for (let i = 0; i < numberOfImages; i++) {
            images[i].setAttribute('class', `card-image${i+1}`);
            console.log(images[i]);
        }
    }
}

/**
 * Turns card over to its back, when re-used turns card over to its front.
 * @returns the altText value for the flipped over card; the function re-uses this value when called again to turn over the same card.
 */
function turnCardOver() {

    soundFlipCard.play();

    let firstCard = document.getElementById('dealer-cards').children[0];
    let altText = firstCard.alt

    if (altText === 'back-of-card') {

        firstCard.remove();

        let flippedCard = document.createElement('img');
        flippedCard.src = 'assets/images/' + storeFirstCard + '.png';
        flippedCard.alt = storeFirstCard;

        document.getElementById('dealer-cards').prepend(flippedCard);

        updateSumHtml('dealer');

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
 * Input arrayOfHand; calculates total sum of hand card values and number of aces held.
 * @returns an object - {value: , aces: }
 */
function handValues(array) {

    let value = 0;
    let numberOfAces = 0;

    for (let i = 0; i < array.length; i++) {

        let cardValueString = array[i].split('-');

        if (cardValueString[1] === 'ace') {
            value += 11;
            numberOfAces += 1;

            // https://stackoverflow.com/questions/2363840/how-to-use-or-condition-in-a-javascript-if-statement
            // quote: "Note that if you use string comparisons in the conditions, you need to perform a comparison for each condition..
            // ..otherwise if you only do it in the first one, then it will always return true" - this helped tremendously!
        } else if (cardValueString[1] === 'jack' || cardValueString[1] === 'queen' || cardValueString[1] === 'king') {
            value += 10;

            // 'assets/images/back-of-card.png' - cardValueString[1] is 'of' - if not included results showed NaN.
        } else if (cardValueString[1] === 'of') {
            value += 0;

        } else {
            value += parseInt(cardValueString[1]);
        }

        // Checks number of aces and depending on the score; decides whether an ace should be valued at 11 or 1.
        if (value > 21 && numberOfAces > 0) {
            value -= 10;
            numberOfAces -= 1;

        } else {
            continue;
        }
    }
    return {
        value: value,
        aces: numberOfAces
    };
}

/**
 * Updates the total sum in either the dealer's hand or the player's hand in the HTML (depending on what parameters were chosen).
 * @param {*} who - either 'dealer' or 'player'
 */
function updateSumHtml(who) {

    if (who === 'player') {

        let showSum = document.getElementById('player-sum');
        let totalSum = handValues(getImageAltData('player-cards'));
        showSum.innerHTML = totalSum.value;

    } else if (who === 'dealer') {

        let showSum = document.getElementById('dealer-sum');
        let totalSum = handValues(getImageAltData('dealer-cards'));
        showSum.innerHTML = totalSum.value;

    } else {

        throw `${who} not defined. Aborting function!`;
    }
}

/**
 * Deals a card to the player if they're handValues value is < 21. Otherwise alerts them of they're 'bust' hand.
 */
function hit() {

    let playerSum = handValues(getImageAltData('player-cards')).value;

    if (playerSum <= 20) {

        dealCard('player-cards');
        handValues(getImageAltData('player-cards')).value;
        updateSumHtml('player');

    } else if (playerSum === 21) {

        alert('You have 21, the best score you can get! Press "Stand" to continue!')

    } else {

        alert('Your hand is bust, you cannot hit!');
    }
}

function dealersTurn() {

    turnCardOver();

    let dealerSum = handValues(getImageAltData('dealer-cards')).value;
    let playerSum = handValues(getImageAltData('player-cards')).value;

    while (dealerSum < 17) {

        dealCard('dealer-cards');

        dealerSum = handValues(getImageAltData('dealer-cards')).value;
        updateSumHtml('dealer');
    }

    if (playerSum > 21) {
        console.log('Dealer wins!');
        soundLoseHand.play();
    } else if (dealerSum > playerSum && !(dealerSum > 21)) {
        console.log('Dealer wins!');
        soundLoseHand.play();
    } else if (dealerSum > 21 && !(playerSum > 21)) {
        console.log('Player wins!');
        soundWinHand.play();
    } else if (dealerSum < playerSum) {
        console.log('Player wins!');
        soundWinHand.play();
    } else if (dealerSum === playerSum) {
        console.log("It's a Draw");
    } else {
        throw 'undefined score system';
    }
}

function submitScore() {

    console.log('Submitting Score');
}

/**
 * Makes and shuffles the deck, ready for play
 */
function shuffleDeck() {

    soundShuffleDeck.play();

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