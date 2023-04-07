// search for and ADJUST/DELETE all 'NOTE' comments!

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