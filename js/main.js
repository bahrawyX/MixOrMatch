class AudioController {
    constructor() {
        this.bgMusic = new Audio('../Assets/Audio/creepy.mp3')
        this.flipSound = new Audio('../Assets/Audio/flip.wav')
        this.matchSound = new Audio('../Assets/Audio/match.wav')
        this.victorySound = new Audio('../Assets/Audio/victory.wav')
        this.gameoverSound = new Audio('../Assets/Audio/gameOver.wav')
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameoverSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
}

class mixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.remainingTime = totalTime;
        this.flips = document.getElementById('flips');
        this.timer = document.getElementById('time-remaining');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.remainingTime = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerText = this.totalTime;
        this.flips.innerHTML = this.totalClicks;
    }


    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.flips.innerHTML = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card)
            } else {
                this.cardToCheck = card;
            }
        }

    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.missMatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }

    }
    missMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000)
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    shuffleCards(cardsArray) { // Fisher-Yates Shuffle Algorithm.
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }


    canFlipCard(card) {
        return (!this.busy && card !== this.cardToCheck && !this.matchedCards.includes(card))
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }


    startCountDown() {
        return setInterval(() => {
            this.remainingTime--;
            this.timer.innerText = this.remainingTime;
            if (this.remainingTime === 0) {
                this.gameOver()
            }
        }, 1000)
    }


    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible')

    }


    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('game-winner-text').classList.add('visible')
    }
}



function ready() {
    let overlay = Array.from(document.getElementsByClassName('overlay-text')) //html collection
    let card = Array.from(document.getElementsByClassName('flip-card')) //html collection
    let game = new mixOrMatch(100, card);
    overlay.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    card.forEach(Cards => {
        Cards.addEventListener('click', () => {
            game.flipCard(Cards);
        })
    })

}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready())
} else {
    ready();
} //if the html is loaded, then run the ready function else wait for the html to load