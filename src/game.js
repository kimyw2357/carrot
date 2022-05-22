'use strict'
import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel'
});

export class Game {
  constructor() {
    this.carror_count = 15;
    this.bug_count = 15;
    this.started = false;
    this.score = 0;
    this.timer = undefined;
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      } 
    });
    this.gameField = new Field();
    this.gameField.setClickListener(this.onItemClick);
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    this.gameField.moveBugs();
    sound.playBackground();
  }
  
  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.carrot) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carror_count) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  }

  showStopButton() {
    const icon = this.gameBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
  }
  
  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }
  
  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }
  
  startGameTimer() {
    let remainingTimeSec = Math.floor((Math.random() * (15 - 10) + 10));
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.gameField.bugsMoveClearInterval();
        this.stop(this.carror_count === this.score ? Reason.win : Reason.lose);
        return;
      } else {
        this.updateTimerText(--remainingTimeSec);
      }
    }, 1000);
  }
  
  stopGameTimer(){
    clearInterval(this.timer);
    this.gameField.bugsMoveClearInterval();
  }
  
  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }
  
  initGame() {
    this.score = 0;
    this.carror_count = Math.floor((Math.random() * (15 - 10) + 10));
    this.bug_count = Math.floor((Math.random() * (20 - 15) + 15));
    this.gameScore.innerText = this.carror_count;
    this.gameField.init(this.carror_count, this.bug_count);
  } 
  
  updateScoreBoard() {
   this.gameScore.innerText = this.carror_count - this.score;
  }
}