'use strict'

const CARROT_SIZE = 80;
let carror_count = 15;
let bug_count = 15;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let started = false;
let score = 0;
let timer = undefined;
let bugsMoveInterval = [];

field.addEventListener('click', onFieldClick);

gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  } 
});

popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  moveBugs();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY❓');
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  hideGameButton();
  win ? playSound(winSound) : playSound(bugSound);  
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win? 'YOU WON👍' : 'YOU LOST💥');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fa-solid');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = Math.floor((Math.random() * (15 - 10) + 10));
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      bugsMoveInterval.forEach(bug => {
        clearInterval(bug);
      })
      finishGame(carror_count === score);
      return;
    } else {
      updateTimerText(--remainingTimeSec);
    }
  }, 1000);
}

function stopGameTimer(){
  clearInterval(timer);
  bugsMoveInterval.forEach(bug => {
    clearInterval(bug);
  })
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up-hide');
}

function hidePopUp() {
  popUp.classList.add('pop-up-hide');
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  carror_count = Math.floor((Math.random() * (15 - 10) + 10));
  bug_count = Math.floor((Math.random() * (20 - 15) + 15));
  gameScore.innerText = carror_count;
  addItem('carrot', carror_count, 'img/carrot.png');
  addItem('bug', bug_count, 'img/bug_left.png');
} 

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === carror_count) {
      finishGame(true);
    }
  } else if (target.matches('.bug')) {
    finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = carror_count - score;

}

function addItem (className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function moveBugs() {
  const bugs = document.querySelectorAll('.bug');
  const fieldWidth = fieldRect.width - CARROT_SIZE;
  bugs.forEach(bug => {
    let rightMove = false;
    if (Math.floor((Math.random()*2))) {
      rightMove = true;
      bug.src = 'img/bug_right.png';
    } 
    bugsMoveInterval.push(setInterval(() => {
      let movePx = undefined;
      const bugLeftPx = getComputedStyle(bug).left;
      const bugLeftNum = Number(bugLeftPx.slice(0, -2));
    if (rightMove) {
      if (bugLeftNum >= fieldWidth) {
        rightMove = false;
        bug.src = 'img/bug_left.png';
        return;
      }
      movePx = bugLeftNum + 10;
      bug.style.left = `${movePx}px`;
    } else {
      if (bugLeftNum <= 0) {
        rightMove = true;
        bug.src = 'img/bug_right.png';
        return;
      }
      movePx = bugLeftNum - 10;
      bug.style.left = `${movePx}px`;
    } 
   },50));
  });
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
