# Blackjack: 5 Minute Challenge

## Table of Contents
1. [Strategy: The Who and Why](#strategy-the-who-and-why)
2. [Scope: What Features Are Required](#scope-what-features-are-required)
3. [Structure: Shaping The Site](#structure-shaping-the-site)
4. [Skeleton: The View For The User](#skeleton-the-view-for-the-user)
5. [Testing, Struggles, and Future Features](#testing-struggles-and-future-features)
    1. [Testing](#testing)
    2. [Bugs/Challenges](#bugschallenges)
6. [Feature Ideas For The Future](#feature-ideas-for-the-future)
7. [Technologies Used](#technologies-used)
8. [Deployment](#deployment)
9. [Development](#development)
10. [Credits](#credits)
    1. [Content](#content)
    2. [Media](#media)

## Strategy: The Who and Why

This card game is primarily intended for someone who is already quite familiar with the casino game "Blackjack". A summarised ruleset is present for new players and anyone wanting to familiarise themselves with the game. A link to the full ruleset can also be found.

The idea of the game is for the player to reach the highest possible score in 3 minutes and to compete for a higher score each time. The quick 3 minute nature of the game rounds means players can spend a small amount of time as downtime, during commuting or while waiting for someone.

As a player, I would seek to beat my own high score every time I play. I would also share the game with my friends to add to the competitive nature of the game and let know what high scores I was able to achieve. The high risk, high reward nature of any casino game drives this attention naturally.

You can view the deployed website by clicking [**here**](https://destant.github.io/blackjack-3-minute-challenge/).

## Scope: What Features Are Required

### The Draw Deck and Its Shuffle Function
![Draw Deck](/documentation/draw-deck.png)
* This function makes a fresh deck of cards:\
![Make Deck Function](/documentation/function-make-deck.png)
* This function shuffles that array and randomizes it:\
![Shuffle Deck Function](/documentation/function-shuffle-deck.png)

### The 'Hit', 'Split' and 'Stand' Functions

#### __Hit__
![Hit Function](/documentation/function-hit.png)
![Player Sum](/documentation/player-sum.png)
* As long as the player has a sum below 21 the 'Hit' function allows the player to draw another card.
* Aces are automatically considered at their higher value of 11.
  * When the player exceeds 21, one ace at a time is automatically recalculated to be worth 1 instead until a score of 21 or below is reached.
* If the player exceeds 21; the round is automatically lost.
  * The 'Deal' button is revealed to deal out the new round.\
![Deal Button](/documentation/deal-button.png)

![Blackjack, 21](/documentation/perfect-score.png)
![Player Sum 21](/documentation/player-sum-21.png)
* When the player has 21 points exactly, the 'Hit' button will grey out and stop functioning.
  * This is to stop accidental clicks when you have the best score.

#### __Split__
![Split Function](/documentation/function-split.png)
* If two identical cards are dealt at the beginning of a round, the 'Split' button will appear.
  * Players can decide to split or continue playing as normal.

![Split Function Pressed](/documentation/after-split.png)
* If the player decides to split, the left card is put aside (as seen in image - bordered in red).
  * A side bet, matching the original bet, is created (as seen in image - blue border).
    * Split bets can only be initiated if the player has enough cash to match original bet.
  * The 'Player Sum' is updated (green border).
* Once the first card is played, the second card is put into play.

#### __Stand__
* Once the player is happy with their score, they can choose to 'Stand'
  * This initiates the dealers turn:
    * The dealer will automatically draw cards until their obligation to score at least 17 is met.
  * Once the dealer has had their turn:
    * If dealer is bust (score above 21); player wins and cashes out double their bet.
    * Likewise; if the player has a higher score than the dealer.
      * The winning 'chime' sound is played.
      * The 'You Won!' text pops up for 1.5s below the 'Player Sum'.\
      ![Win Text](/documentation/win-text.png)
    * If dealer exceeds your score; you lose and lose your bet.
      * The 'Awww' sound effect is played.
      * The 'You Lose.' text pops up for 1.5s below the 'Player Sum'.\
      ![Lose Text](/documentation/lose-text.png)
    * In case of a draw; nobody wins, you retain your bet.
      * The 'Draw!' text pops up for 1.5s below the 'Player Sum'.\
      ![Draw Text](/documentation/draw-text.png)

### The Poker Chips and Betting




## Structure: Shaping The Site

## Skeleton: The View For The User

## Testing, Struggles, and Future Features

### __Testing__

__Lighthouse Tests__

* Pictures!

The project was also tested via friends and family; using their native web browsers for responsiveness using these devices/tools:
  * Monitor 25" screen
  * Windows laptop 15" screen
  * iPhone 12 Pro Max
  * OnePlus 8
  * iPad Pro 12.9" screen
  * iPad Pro 11" screen
  * Chrome dev tools for various other options

__Validator Testing__

RECHECK THIS!

- HTML - No errors or warnings to show. Link to report [here](https://validator.w3.org/nu/?doc=https%3A%2F%2Fdestant.github.io%2Fblackjack-5-minute-challenge%2F).
- CSS - No errors found. Link to report [here](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fdestant.github.io%2Fblackjack-5-minute-challenge%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en).
- JavaScript - No errors found. ADD PICTURE HERE + TALK ABOUT CONFIGURATIONS OF TEST.

### __Bugs/Challenges__

__Challenges__

__Unfixed Bugs__

### __Feature Ideas For The Future__

## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express

## Deployment

The project was deployed on GitHub pages from the 'Main Branch Source Code' using the following steps:
* 'git add .', 'git commit" and 'git push' commands were issued one final time when the project was ready and finished.
* On Github the repository for the project was selected.
* Click the 'Settings' tab.
* On the left; select 'Pages'.
* From here; select the source as 'Main Branch'.
* Click 'Save'.

GitHub may take a few minutes to deploy the website so be patient.

The live link to my project can be found [**here**](https://destant.github.io/blackjack-5-minute-challenge/).

## Development

Should anyone wish to add to the project, please feel free to open a new workspace within its current state; then commit and push any changes to the main branch. I will review and add them to the main branch as soon as possible. Thank you!

Should anyone wish to copy and paste the project - you are also welcome to - please remember to give me some credit!

## Credits 

### __Content__

* The wireframe was made using the [Endless Paper App](https://endlesspaper.app/) on the iPad.
* To help me find and visualize the font I used [Fontjoy](https://fontjoy.com/).
* [W3Schools](https://www.w3schools.com/), [Stack Overflow](https://stackoverflow.com/), [Mozilla Dev Tools](https://developer.mozilla.org) was referred to a lot for general syntax and whenever I was stuck on a bug for a while - other similar experiences helped me build a better app.
* [FontAwesome](https://fontawesome.com/) for the "X" mark in the pop-up modal.

### __Media__

* The poker chip images are from [PngAAA](https://www.pngaaa.com/).
* The playing cards .png are from [Super Dev Resources](https://superdevresources.com/free-playing-cards-set/).
* The sound effects are from [Epidemic Sound](https://www.epidemicsound.com/).
* To compress .PNG [CompressPNG](https://compresspng.com/).