// search for and ADJUST/DELETE all 'NOTE' comments!

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
    console.log('Game Running!');
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