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

// known issue:
// - when start game click before anything else is touched on screen; sound effects dont work - maybe mute them to begin with?
// - the start button is covered by the div above (iphone) - makes the start button hard to click!

// Global Variables
let gameDeck = [];

// Sound Effects:
const soundDealSingle = document.getElementById('deal-single');
const soundFlipCard = document.getElementById('flip-card');
const soundWinHand = document.getElementById('win-hand');
const soundLoseHand = document.getElementById('lose-hand');
const soundShuffleDeck = document.getElementById('shuffle-deck');

// Event Listeners and initial hiding of buttons:
document.addEventListener('DOMContentLoaded', function () {

    let startButton = document.getElementById('start');
    startButton.addEventListener('pointerdown', startGame);

    let dealNewHandButton = document.getElementById('deal-new-hand');
    dealNewHandButton.addEventListener('pointerdown', dealNewHand);
    dealNewHandButton.classList.add('hidden');

    let hitButton = document.getElementById('hit');
    hitButton.addEventListener('pointerdown', hit);
    hitButton.classList.add('hidden');

    let splitButton = document.getElementById('split');
    splitButton.addEventListener('pointerdown', splitHand);
    splitButton.classList.add('hidden');

    let standButton = document.getElementById('stand');
    standButton.addEventListener('pointerdown', dealersTurn);
    standButton.classList.add('hidden');
})

/**
 * Toggles button visibility by adding/removing CSS class.
 * @param {button} id 
 */
function toggleButtonVisibility(id) {

    let button = document.getElementById(id);

    if (button.classList.contains('hidden')) {
        button.classList.remove('hidden');
    } else {
        button.classList.add('hidden');
    }
}

/**
 * Start game function.
 */
function startGame() {

    toggleButtonVisibility('start') // hides

    makeFreshDeck();
    shuffleDeck(gameDeck);
    startCountdownTimer();
    
    dealNewHand();
    toggleButtonVisibility('deal-new-hand'); // Off

    console.log('Game Running!');
}

/**
 * Makes a fresh deck. Pushes array to global gameDeck variable.
 */
function makeFreshDeck() {

    gameDeck = [];
    let suit = ['clubs', 'diamonds', 'hearts', 'spades'];
    let rank = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

    // loops through and combines 'suit' and 'rank' arrays; makes an ordered deck of cards.
    for (let s = 0; s < suit.length; s++) {
        for (let r = 0; r < rank.length; r++) {
            gameDeck.push(suit[s] + '-' + rank[r]);
        }
    }
}

/**
 * Shuffles a deck of cards by randomly drawing from it and placing it in a temporary variable.
 * Once all cards are drawn the temporary deck copies itself onto global variable; gameDeck.
 * @param {array} deck 
 */
function shuffleDeck(deck) {

    soundShuffleDeck.play();

    let tempDeck = [];
    for (let i = deck.length; i > 0; i--) {

        let randomNumber = Math.floor(Math.random() * i);
        let randomCard = deck.splice(randomNumber, 1);
        tempDeck.push(randomCard);
    }
    gameDeck = tempDeck;
}

/**
 * Starts a 5 minute timer
 */
function startCountdownTimer() {

    let timer = 300;
    let myInterval = setInterval(countdownTimer, 1000);

    function countdownTimer() {

        if (timer >= 0) {

            const countdownTimer = document.getElementById('countdown-timer');

            let minutes = Math.floor(timer / 60);
            let seconds = timer % 60;

            // redundant in a 5 minute timer, could have just added a '0' to innerHTML;
            // incase I decide to increase timer.
            minutes = minutes < 10 ? '0' + minutes : minutes;
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

/**
 * Deals a card to the hand specified - use either 'dealer' or 'player'.
 * Also checks to see how many cards each hand is holding; stacks cards in html when > 4.
 */
function dealCard(DealerOrPlayer) {

    soundDealSingle.play();

    let drawCard = gameDeck.pop();

    let cardImage = document.createElement('img');
    cardImage.src = 'assets/images/' + drawCard + '.png';
    cardImage.alt = `${drawCard}`;

    document.getElementById(`${DealerOrPlayer}-cards`).append(cardImage);
    updateHtml(`${DealerOrPlayer}`);

    // Counts the amount of images in hand of ('div') and if it is more than 4;
    // stacks the cards (via CSS) for easier viewing.
    let htmlDiv = document.getElementById(`${DealerOrPlayer}-cards`);
    let images = htmlDiv.getElementsByTagName('img');
    numberOfImages = images.length;

    if (numberOfImages >= 4) {
        for (let i = 0; i < numberOfImages; i++) {
            images[i].setAttribute('class', `card-image${i+1}`);
        }
    }
}

/**
 * Turns card over to its back, when re-used turns card over to its front.
 * @returns the altText value for the flipped over card; the function;
 * re-uses this value when called again to turn over the same card.
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

        updateHtml('dealer');

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
 * Deals 2 cards to the dealer and the player.
 * Dealer's first card is facedown.
 * (Initially checks if deck has enough cards for the new round)
 */
function dealNewHand() {

    // If gameDeck < 15; shuffle new deck.
    let remainingCards = gameDeck.length;
    if (remainingCards < 15) {
        makeFreshDeck();
        shuffleDeck(gameDeck);
    }

    turnCardOver(dealCard('dealer'));
    dealCard('player');
    dealCard('dealer');
    dealCard('player');

    // Checks if first two cards in players hand have identical values. 
    // If true; allows player to split hand.
    if (checkCanSplit(getImageAltData('player-cards'))) {
        toggleButtonVisibility('split');
    }

    toggleButtonVisibility('deal-new-hand') // Off
    toggleButtonVisibility('hit'); // On
    toggleButtonVisibility('stand'); // On
}

/**
 * Checks the first 2 items of an array and compares their values.
 * If values match; return true.
 * @param {getImageAltData('player-cards')} array 
 * @returns true or false
 */
function checkCanSplit(array) {

    let hand = [];

    for (let i = 0; i < 2; i++) {

        let cardData = array[i].split('-');
        hand.push(cardData[1]);
    }

    if (hand[0] === hand[1]) {
        return true;
    } else {
        return false;
    }
}

/**
 * Sets one of the identical cards from the player aside.
 * This card is played in the next round.
 */
function splitHand() {

    soundFlipCard.play();

    let firstCard = document.getElementById('player-cards').children[0];
    let altText = firstCard.alt

    firstCard.remove();

    let cardImage = document.createElement('img');
    cardImage.src = 'assets/images/' + altText + '.png';
    cardImage.alt = `${altText}`;

    document.getElementsByClassName('split-hand')[0].append(cardImage);
    toggleButtonVisibility('split');
}

/**
 * Deals a card to the player if they're handValues value is < 21.
 * Otherwise alerts player of 'bust' hand.
 */
function hit() {

    let playerSum = handValues(getImageAltData('player-cards')).value;

    if (playerSum <= 20) {

        dealCard('player');
        handValues(getImageAltData('player-cards')).value;
        updateHtml('player');

    } else if (playerSum === 21) {

        alert('You have 21, the best score you can get! Press "Stand" to continue!')

    } else {

        alert('Your hand is bust, you cannot hit!');
    }
}

/**
 * Dealer takes its turn.
 * Will continue taking cards until at least 17 handValue is reached.
 */
function dealersTurn() {

    toggleButtonVisibility('hit');
    toggleButtonVisibility('stand');
    turnCardOver();

    let dealerSum = handValues(getImageAltData('dealer-cards')).value;

    while (dealerSum < 17) {

        dealCard('dealer');

        dealerSum = handValues(getImageAltData('dealer-cards')).value;
        updateHtml('dealer');
    }
    decideWinner();
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
function updateHtml(DealerOrPlayer) {

    let remainingCardsSpan = document.getElementById('draw-deck-remaining');
    let remainingCards = gameDeck.length;
    remainingCardsSpan.innerHTML = remainingCards;

    let showSum = document.getElementById(`${DealerOrPlayer}-sum`);
    let totalSum = handValues(getImageAltData(`${DealerOrPlayer}-cards`));
    showSum.innerHTML = totalSum.value;
}

/**
 * Once the dealer has also had its turn; this function calculates 
 */
function decideWinner() {

    let dealerSum = handValues(getImageAltData('dealer-cards')).value;
    let playerSum = handValues(getImageAltData('player-cards')).value;

    let winLossText = document.getElementById('win-loss-text');

    if (playerSum > 21) {
        console.log('Dealer wins!');
        winLossText.innerHTML = 'Sorry, you lose.'
        soundLoseHand.play();
    } else if (dealerSum > playerSum && !(dealerSum > 21)) {
        console.log('Dealer wins!');
        winLossText.innerHTML = 'You lose.'
        soundLoseHand.play();
    } else if (dealerSum > 21 && !(playerSum > 21)) {
        console.log('Player wins!');
        winLossText.innerHTML = 'You won!'
        soundWinHand.play();
    } else if (dealerSum < playerSum) {
        console.log('Player wins!');
        winLossText.innerHTML = 'You won!'
        soundWinHand.play();
    } else if (dealerSum === playerSum) {
        console.log("It's a Draw");
        winLossText.innerHTML = 'Draw!'
    } else {
        throw 'undefined score system';
    }

    // Displays win/loss text for 1000ms/1s
    toggleButtonVisibility('win-loss-text');
    setTimeout(function () {
        toggleButtonVisibility('win-loss-text');
    }, 1000);

    // Allows for some breathing time before player is expected to deal new hand.
    setTimeout(function () {
        clearTable();
    }, 1500);
}

/**
 * Loops through both hands to see number of cards, then removes all card; clearing both sides of the table.
 */
function clearTable() {

    const bothHands = document.getElementsByClassName('dealt-cards');

    for (let h = (bothHands.length); h > 0; h--) {
        const allCards = bothHands[h - 1].children; // -1 takes into account array [0]
        for (let c = (allCards.length); c > 0; c--) {
            allCards[c - 1].remove(); // -1 takes into account array [0]
        }
    }
    toggleButtonVisibility('deal-new-hand');
}

function submitScore() {

    console.log('Submitting Score');
}