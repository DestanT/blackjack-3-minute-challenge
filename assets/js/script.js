// Global Variables
let gameDeck = [];

// Sound Effects:
const soundDealSingle = document.getElementById('deal-single');
const soundFlipCard = document.getElementById('flip-card');
const soundWinHand = document.getElementById('win-hand');
const soundLoseHand = document.getElementById('lose-hand');
const soundShuffleDeck = document.getElementById('shuffle-deck');
const soundPlaceBet = document.getElementById('poker-chip-single');
const soundBustHand = document.getElementById('bust-hand');
const soundBoing = document.getElementById('boing');
const soundPokerChipWinnings = document.getElementById('poker-chip-winnings');
const soundDeductBet = document.getElementById('deduct-bet');

// Animations:
/**
 * Plays one iteration of the poker chip animation - via css.
 * 
 * @param {string} colour 
 */
function playPokerChipAnimation(colour) {
    const pokerChip = document.getElementById(`${colour}-chip-animation`);
    pokerChip.classList.add('poker-chip-animation');

    setTimeout(function () {
        pokerChip.classList.remove('poker-chip-animation');
    }, 500);
}

/**
 * Plays 2 animations to deduct chip value; with a slight delay between them.
 */
function deductBetAnimation() {
    // First chip animation
    const minusChip1 = document.getElementById('deduct-animation-1');
    minusChip1.classList.add('poker-chip-deduct-animation');

    setTimeout(function () {
        minusChip1.classList.remove('poker-chip-deduct-animation');
    }, 500);

    // Second Chip animation
    const minusChip2 = document.getElementById('deduct-animation-2');

    setTimeout(function () {
        minusChip2.classList.add('poker-chip-deduct-animation');
    }, 100);

    setTimeout(function () {
        minusChip2.classList.remove('poker-chip-deduct-animation');
    }, 600);
}

/**
 * Plays one iteration of the deal card animation - via css.
 * 
 * @param {string} DealerOrPlayer 
 */
function animationDealCard(DealerOrPlayer) {
    const animationCard = document.getElementById('deal-card-animation');
    animationCard.classList.add(`deal-${DealerOrPlayer}-animation`);

    setTimeout(function () {
        animationCard.classList.remove(`deal-${DealerOrPlayer}-animation`);
    }, 500);
}

// Event Listeners and initial hiding of buttons:
document.addEventListener('DOMContentLoaded', function () {
    // If localStorage for 'playerName' already exists:
    const playerNameSpan = document.getElementById('name-span');
    const nameInputScreen = document.getElementById('name-input-screen');
    
    if (localStorage.getItem('playerName') !== 'null') {
        // Closes the modal window.
        nameInputScreen.classList.remove('modal-window');
        nameInputScreen.children[0].classList.remove('modal-content');
        nameInputScreen.classList.add('display-off');
        nameInputScreen.children[0].classList.add('display-off');

        // Updates players name in the rules section.
        playerNameSpan.innerHTML = `Welcome back ${localStorage.getItem('playerName')}!`;
    }

    // Input Name Field:
    const inputButton = document.getElementById('enter-name');
    inputButton.addEventListener('pointerdown', function (event) {
        event.preventDefault();

        // Saves the players name on local storage. Minimum 2 letters.
        const playerName = document.getElementById('input-name');
        if (playerName.value.length >= 2) {
            localStorage.setItem('playerName', playerName.value);

            // Closes the modal window.
            nameInputScreen.classList.remove('modal-window');
            nameInputScreen.children[0].classList.remove('modal-content');
            nameInputScreen.classList.add('display-off');
            nameInputScreen.children[0].classList.add('display-off');

            // Updates players name in the rules section.
            playerNameSpan.innerHTML = `Hi ${localStorage.getItem('playerName')}.`;
        }
    })

    // Buttons:
    const startButton = document.getElementById('start');
    startButton.addEventListener('pointerdown', startGame);

    const dealNewRoundButton = document.getElementById('deal');
    dealNewRoundButton.addEventListener('pointerdown', dealNewRound);
    dealNewRoundButton.classList.add('display-off');

    const hitButton = document.getElementById('hit');
    hitButton.addEventListener('pointerdown', hit);
    hitButton.classList.add('hidden');

    const splitButton = document.getElementById('split');
    splitButton.addEventListener('pointerdown', splitHand);
    splitButton.classList.add('hidden');

    const standButton = document.getElementById('stand');
    standButton.addEventListener('pointerdown', dealersTurn);
    standButton.classList.add('hidden');

    const gameRulesSpan = document.getElementById('game-rules-span');
    gameRulesSpan.addEventListener('pointerdown', function () {
        // Add css classes that are applied to the 'game rules' div. Pops up a modal window.
        const gameRulesModal = document.getElementById('game-rules-modal');
        gameRulesModal.classList.add('pop-up-rules-modal');
        const gameRulesContent = document.getElementById('game-rules-content');
        gameRulesContent.classList.add('pop-up-rules-content');
        // Removes css classes to 'turn off' modal when X icon is pressed.
        const closeButton = document.getElementById('x-button');
        closeButton.addEventListener('pointerdown', function () {
            gameRulesModal.classList.remove('pop-up-rules-modal');
            gameRulesContent.classList.remove('pop-up-rules-content');
        })
    })

    //Poker Chips:
    const redChip = document.getElementById('red-chip');
    redChip.addEventListener('pointerdown', addBetRed);

    const blueChip = document.getElementById('blue-chip');
    blueChip.addEventListener('pointerdown', addBetBlue);

    const blackChip = document.getElementById('black-chip');
    blackChip.addEventListener('pointerdown', addBetBlack);

    const minusChip = document.getElementById('minus-chip');
    minusChip.addEventListener('pointerdown', deductBet);
});

/**
 * Hides or unhides elements by adding a css class to them.
 * If element is already hidden and the function is instructed to 'add'
 * the 'hidden' css class - the command is simply ignored.
 * 
 * @param {string} 'id'
 * @param {string} 'add' || 'remove'
 * @param {string} 'hidden' || 'display-on' || 'display-off'
 */
function adjustButtonVisibility(id, addRemove, cssClassName) {
    const button = document.getElementById(id);

    if (addRemove === 'add') {
        if (cssClassName === 'display-on' || cssClassName === 'display-off') {
            button.removeAttribute('class'); // Resets classes
            button.classList.add(cssClassName);
        } else if (button.classList.contains(cssClassName) === true) {
            return;
        } else {
            button.classList.add(cssClassName);
        }
    } else if (addRemove === 'remove') {
        if (button.classList.contains(cssClassName) === true) {
            button.classList.remove(cssClassName);
        } else {
            return;
        }
    } else {
        throw new Error('function paramters not in use');
    }
}

/**
 * Start game function.
 */
function startGame() {
    adjustButtonVisibility('start', 'add', 'display-off'); // Hidden
    adjustButtonVisibility('deal', 'add', 'display-off'); // Hidden

    makeFreshDeck();
    shuffleDeck(gameDeck);
    startCountdownTimer();

    dealNewRound();

    console.log('Game Running!');
}

/**
 * Makes a fresh deck. Pushes array to global gameDeck variable.
 */
function makeFreshDeck() {
    gameDeck = [];
    let suit = ['clubs', 'diamonds', 'hearts', 'spades'];
    let rank = [
        'ace',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'jack',
        'queen',
        'king',
    ];

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
 * 
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
 * Checks if enough card are remaining in deck;
 * Deals a new round of 2 cards each.
 * Dealer's first card is facedown.
 */
function dealNewRound() {
    // Checks if player has enough money for the minimum bet of $50.
    const betSpan = document.getElementById('bet-value');
    let betValue = parseInt(betSpan.innerHTML);

    if (betValue === 0) {
        const cashSpan = document.getElementById('cash');
        let cashValue = parseInt(cashSpan.innerHTML);

        if (cashValue < 50) {
            alert('You have no more money, please restart!');
            console.log('you lost all your money'); // NOTE: replace with end of game modal
        } else {
            cashValue -= 50;
            betValue += 50;
            cashSpan.innerHTML = cashValue;
            betSpan.innerHTML = betValue;
        }
    }

    // If gameDeck < 15; shuffle new deck.
    let remainingCards = gameDeck.length;
    if (remainingCards < 15) {
        makeFreshDeck();
        shuffleDeck(gameDeck);
    }

    toggleGrayscale(); // Turns poker chips OFF.

    turnCardOver(dealCard('dealer'));
    // Waits for animations to finish before dealing next cards.
    setTimeout(function () {
        dealCard('player');
    }, 500);
    setTimeout(function () {
        dealCard('dealer');
    }, 1000);
    setTimeout(function () {
        dealCard('player');
    }, 1500);

    // Checks if player can split by comparing image alt data;
    // If true unhides the 'split' button.

    // Animations to deal the 4 card above takes 2000ms; waits for them before executing next commands.
    setTimeout(function () {
        if (checkCanSplit(getImageAltData('player-cards'))) {
            adjustButtonVisibility('split', 'remove', 'hidden'); // Visible
        }

        adjustButtonVisibility('hit', 'remove', 'hidden'); // Visible
        adjustButtonVisibility('stand', 'remove', 'hidden'); // Visible
    }, 1500);
    adjustButtonVisibility('deal', 'add', 'display-off'); // Hidden immediately.
}

/**
 * Deals a card to specified hand.
 * If cards in hand reach > 3; adds classes for stacking effect - via css.
 * 
 * @param {string} 'dealer' || 'player'
 */
function dealCard(DealerOrPlayer) {
    soundDealSingle.play();
    animationDealCard(`${DealerOrPlayer}`);

    let drawCard = gameDeck.pop();

    let cardImage = document.createElement('img');
    cardImage.src = 'assets/images/' + drawCard + '.png';
    cardImage.alt = `${drawCard}`;

    document.getElementById(`${DealerOrPlayer}-cards`).append(cardImage);
    updateHtml(`${DealerOrPlayer}`);

    // Counts the amount of images in hand of ('div') and if it is more than 3;
    // stacks the cards (via CSS) for easier viewing.
    let htmlDiv = document.getElementById(`${DealerOrPlayer}-cards`);
    let images = htmlDiv.getElementsByTagName('img');
    const numberOfImages = images.length;

    if (numberOfImages >= 3) {
        for (let i = 0; i < numberOfImages; i++) {
            images[i].setAttribute(
                'class',
                `stack-${numberOfImages}-card-${[i + 1]}`
            );
        }
    }
}

/**
 * Flips card on its back;
 * flips back when re-used.
 * 
 * @returns .alt of flipped card 
 */
function turnCardOver() {
    soundFlipCard.play();

    let firstCard = document.getElementById('dealer-cards').children[0];
    altText = firstCard.alt;

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
 * Checks first two cards of the player's hand.
 * 
 * @param {array} player cards
 * @returns true || false
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
    const cashSpan = document.getElementById('cash');
    const betSpan = document.getElementById('bet-value');
    const sideBet = document.getElementById('side-bet-value');

    let cashValue = parseInt(cashSpan.innerHTML);
    let betValue = parseInt(betSpan.innerHTML);

    if (cashValue >= betValue) {
        sideBet.innerHTML = betValue;
        cashSpan.innerHTML = cashValue - betValue;

        soundPlaceBet.play();
        soundFlipCard.play();

        let firstCard = document.getElementById('player-cards').children[0];
        let altText = firstCard.alt;

        firstCard.remove();

        let cardImage = document.createElement('img');
        cardImage.src = 'assets/images/' + altText + '.png';
        cardImage.alt = `${altText}`;

        document.getElementById('split-hand').append(cardImage);

        // Slight delay necessary to have cards in place, before update can take place.
        setTimeout(function () {
            updateHtml('player');
        }, 100);

        adjustButtonVisibility('side-bet-span', 'remove', 'hidden'); // Visible
        adjustButtonVisibility('side-bet-value', 'remove', 'hidden'); // Visible
        adjustButtonVisibility('split', 'add', 'hidden'); // Hidden
    } else {
        soundBoing.play();
        alert('Sorry! You do not have enough cash to match your original bet!');
    }
}

/**
 * Deals a card to the player if hand value is < 21.
 * Otherwise alerts player of 'bust' hand.
 */
function hit() {
    let playerSum = handValues(getImageAltData('player-cards')).value;

    if (playerSum <= 20) {
        dealCard('player');

        playerSum = handValues(getImageAltData('player-cards')).value;
        if (playerSum > 21) {
            soundBustHand.play();
            decideWinner(); // Immediately lose hand on 'bust'
            adjustButtonVisibility('hit', 'add', 'hidden'); // Hidden
        }
    } else if (playerSum === 21) {
        alert(
            'You have 21, the best score you can get! Press "Stand" to continue!'
        );
    }
}

/**
 * Dealer takes its turn.
 * Will continue taking cards until at least 17 hand value is reached.
 */
function dealersTurn() {
    adjustButtonVisibility('hit', 'add', 'hidden'); // Hidden
    adjustButtonVisibility('stand', 'add', 'hidden'); // Hidden

    toggleGrayscale(); // Turns poker chips off - no betting after 'stand'
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
 * Decides the outcome of the round,
 * bet earnings are calculated.
 */
function decideWinner() {
    const dealerSum = handValues(getImageAltData('dealer-cards')).value;
    const playerSum = handValues(getImageAltData('player-cards')).value;

    const winLossText = document.getElementById('win-loss-text');

    const cashSpan = document.getElementById('cash');
    const betSpan = document.getElementById('bet-value');

    let cashValue = parseInt(cashSpan.innerHTML);
    let betValue = parseInt(betSpan.innerHTML);

    if (playerSum > 21) {
        console.log('Dealer wins!');

        // In case player doesn't have enough money in hand; accounts for it in the new bet and adjusts to maximum possible.
        if (betValue > cashValue) {
            let difference = betValue - cashValue; // Example: bet = 500, cash = 150; difference = 350
            betSpan.innerHTML = (betValue - difference); // bet HTML will show 150
            cashSpan.innerHTML = cashValue - cashValue; // cash HTML will show 0 (150 - 150).
        } else {
            cashSpan.innerHTML = cashValue - betValue;
        }
        winLossText.innerHTML = 'You lose.';
        winLossText.setAttribute('class', 'red-font');
        soundLoseHand.play();
    } else if (dealerSum > playerSum && dealerSum <= 21) {
        console.log('Dealer wins!');

        // In case player doesn't have enough money in hand; accounts for it in the new bet and adjusts to maximum possible.
        if (betValue > cashValue) {
            let difference = betValue - cashValue; // Another example: bet = 800, cash = 0; difference = 0
            betSpan.innerHTML = (betValue - difference); // bet HTML will show 800
            cashSpan.innerHTML = cashValue - cashValue; // cash HTML will show 0 (0 - 0).
        } else {
            cashSpan.innerHTML = cashValue - betValue;
        }
        winLossText.innerHTML = 'You lose.';
        winLossText.setAttribute('class', 'red-font');
        soundLoseHand.play();
    } else if (dealerSum > 21 && playerSum <= 21) {
        console.log('Player wins!');

        if (betValue > cashValue) {
            let difference = betValue - cashValue; // Another example: bet = 800, cash = 0; difference = 0
            betSpan.innerHTML = (betValue - difference); // bet HTML will show 800
            cashSpan.innerHTML = cashValue - cashValue; // cash HTML will show 0 (0 - 0).
        } else {
            cashSpan.innerHTML = cashValue + betValue * 2;
        }
        winLossText.innerHTML = 'You won!';
        winLossText.setAttribute('class', 'green-font');
        soundWinHand.play();
        // Slight delay - sound of paying out poker chip winnings
        setTimeout(function () {
            soundPokerChipWinnings.play();
        }, 500);
    } else if (dealerSum < playerSum) {
        console.log('Player wins!');

        if (betValue > cashValue) {
            let difference = betValue - cashValue; // Another example: bet = 800, cash = 0; difference = 0
            betSpan.innerHTML = (betValue - difference); // bet HTML will show 800
            cashSpan.innerHTML = cashValue - cashValue; // cash HTML will show 0 (0 - 0).
        } else {
            cashSpan.innerHTML = cashValue + betValue * 2;
        }
        winLossText.innerHTML = 'You won!';
        winLossText.setAttribute('class', 'green-font');
        soundWinHand.play();
        // Slight delay - sound of paying out poker chip winnings
        setTimeout(function () {
            soundPokerChipWinnings.play();
        }, 500);
    } else if (dealerSum === playerSum) {
        console.log("It's a Draw");
        winLossText.innerHTML = 'Draw!';
    } else {
        throw 'undefined score system';
    }

    // Displays win/loss text for 1000ms/1s
    adjustButtonVisibility('win-loss-text', 'remove', 'hidden'); // Visibile
    setTimeout(function () {
        adjustButtonVisibility('win-loss-text', 'add', 'hidden'); // Hidden
    }, 1000);

    // Allows for some breathing time before player is expected to deal new hand.
    setTimeout(function () {
        endOfRound();
        resetScoreHtml();
    }, 1500);
}

/**
 * Loops through both hands and removes all cards.
 * If split card = true; puts it into play next.
 */
function endOfRound() {
    const bothHands = document.getElementsByClassName('dealt-cards');

    for (let h = bothHands.length; h > 0; h--) {
        const allCards = bothHands[h - 1].children; // -1 takes into account array [0]
        for (let c = allCards.length; c > 0; c--) {
            allCards[c - 1].remove(); // -1 takes into account array [0]
        }
    }

    // If player has a split card on the side, puts that card into play after clearing table.
    if (checkIfSplit() === true) {
        toggleGrayscale(); // Re-activates poker chips

        const splitCard = document.getElementById('split-hand').children[0];
        const altText = splitCard.alt;

        splitCard.remove();

        const cardImage = document.createElement('img');
        cardImage.src = 'assets/images/' + altText + '.png';
        cardImage.alt = `${altText}`;

        document.getElementById('player-cards').append(cardImage);

        // Deals new hand to dealer
        turnCardOver(dealCard('dealer'));
        dealCard('dealer');

        // Slight delay necessary to have cards in place, before update can take place.
        setTimeout(function () {
            updateHtml('player');
            updateHtml('dealer');
        }, 100);

        adjustButtonVisibility('side-bet-span', 'add', 'hidden'); // Hidden
        adjustButtonVisibility('side-bet-value', 'add', 'hidden'); // Hidden
        adjustButtonVisibility('hit', 'remove', 'hidden'); // Visible
        adjustButtonVisibility('stand', 'remove', 'hidden'); // Visible
    } else {
        adjustButtonVisibility('deal', 'add', 'display-on'); // Visible
    }
}

/**
 * Checks to see if player has a 'split' card on the side.
 * 
 * @returns true || false
 */
function checkIfSplit() {
    const splitCard = document.getElementById('split-hand').children[0];

    if (splitCard === undefined) {
        return false;
    } else {
        return true;
    }
}

/**
 * Loops through selected hand and stores .alt of all cards held.
 * 
 * @param {string} 'dealer-cards' || 'player-cards'
 * @returns array
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
 * Calculates total sum of hand values;
 * considers whether an ace = 11 or 1.
 * 
 * @param {array} getImageAltData 
 * @returns object
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
        } else if (
            cardValueString[1] === 'jack' ||
            cardValueString[1] === 'queen' ||
            cardValueString[1] === 'king'
        ) {
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
        aces: numberOfAces,
    };
}

/**
 * Updates HTML element with the total sum.
 * 
 * @param {string} 'dealer' || 'player'
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
 * Resets scores in HTML.
 */
function resetScoreHtml() {
    let dealerSum = document.getElementById('dealer-sum');
    let playerSum = document.getElementById('player-sum');

    dealerSum.innerHTML = '-';
    playerSum.innerHTML = '-';
}

/**
 * Adds a $5 bet value.
 */
function addBetRed() {
    const cashSpan = document.getElementById('cash');
    const betSpan = document.getElementById('bet-value');

    let cashValue = parseInt(cashSpan.innerHTML);
    let betValue = parseInt(betSpan.innerHTML);

    if (cashValue >= 5) {
        cashValue -= 5;
        betValue += 5;
        cashSpan.innerHTML = cashValue;
        betSpan.innerHTML = betValue;

        soundPlaceBet.play();
        playPokerChipAnimation('red');
    } else {
        soundBoing.play();
        alert('You do not have enough money!');
    }
}

/**
 * Adds a $10 bet value.
 */
function addBetBlue() {
    const cashSpan = document.getElementById('cash');
    const betSpan = document.getElementById('bet-value');

    let cashValue = parseInt(cashSpan.innerHTML);
    let betValue = parseInt(betSpan.innerHTML);

    if (cashValue >= 10) {
        cashValue -= 10;
        betValue += 10;
        cashSpan.innerHTML = cashValue;
        betSpan.innerHTML = betValue;

        soundPlaceBet.play();
        playPokerChipAnimation('blue');
    } else {
        soundBoing.play();
        alert('You do not have enough money!');
    }
}

/**
 * Adds a $50 bet value.
 */
function addBetBlack() {
    const cashSpan = document.getElementById('cash');
    const betSpan = document.getElementById('bet-value');

    let cashValue = parseInt(cashSpan.innerHTML);
    let betValue = parseInt(betSpan.innerHTML);

    if (cashValue >= 50) {
        cashValue -= 50;
        betValue += 50;
        cashSpan.innerHTML = cashValue;
        betSpan.innerHTML = betValue;

        soundPlaceBet.play();
        playPokerChipAnimation('black');
    } else {
        soundBoing.play();
        alert('You do not have enough money!');
    }
}

/**
 * Deducts $100 from betValue and adds it back to players cash.
 * If less than $100, deducts whats available.
 */
function deductBet() {
    const cashSpan = document.getElementById('cash');
    const betSpan = document.getElementById('bet-value');

    let cashValue = parseInt(cashSpan.innerHTML);
    let betValue = parseInt(betSpan.innerHTML);

    if (betValue >= 100) {
        betValue -= 100;
        cashValue += 100;
        betSpan.innerHTML = betValue;
        cashSpan.innerHTML = cashValue;
        soundDeductBet.play();
        deductBetAnimation();
    } else if (betValue < 100 && betValue > 0) {
        const storeValue = betValue;
        betValue -= betValue;
        cashValue += storeValue;
        betSpan.innerHTML = betValue;
        cashSpan.innerHTML = cashValue;
        soundDeductBet.play();
        deductBetAnimation();
    } else {
        soundBoing.play();
    }
}

/**
 * Toggles the poker chips from coloured to grayscale and back.
 * Removes eventListeners and adds them back respectively.
 */
function toggleGrayscale() {
    const redChip = document.getElementById('red-chip');
    const blueChip = document.getElementById('blue-chip');
    const blackChip = document.getElementById('black-chip');
    const whiteChip = document.getElementById('minus-chip');

    if (redChip.classList.contains('grayscale') === true) {
        redChip.classList.remove('grayscale');
        blueChip.classList.remove('grayscale');
        blackChip.classList.remove('grayscale');
        whiteChip.classList.remove('grayscale');

        redChip.addEventListener('pointerdown', addBetRed);
        blueChip.addEventListener('pointerdown', addBetBlue);
        blackChip.addEventListener('pointerdown', addBetBlack);
        whiteChip.addEventListener('pointerdown', deductBet);
    } else {
        redChip.classList.add('grayscale');
        blueChip.classList.add('grayscale');
        blackChip.classList.add('grayscale');
        whiteChip.classList.add('grayscale');

        redChip.removeEventListener('pointerdown', addBetRed);
        blueChip.removeEventListener('pointerdown', addBetBlue);
        blackChip.removeEventListener('pointerdown', addBetBlack);
        whiteChip.removeEventListener('pointerdown', deductBet);
    }
}

function submitScore() {
    console.log('Submitting Score');
}