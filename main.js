'use strict'
const CARROT_SIZE = 80;
const CARROR_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

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
  started = !started;
});

function startGame() {
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  moveBugs();
}


function stopGame() {
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY?');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fa-play');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
}

function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      bugsMoveInterval.forEach(bug => {
        clearInterval(bug);
      })
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

function initGame() {
  field.innerHTML = '';
  gameScore.innerText = CARROR_COUNT;
  addItem('carrot', CARROR_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
} 

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    target.remove();
    score++;
    updateScoreBoard();
    if (score === CARROR_COUNT) {
      finishGame();
    }
  } else if (target.matches('.bug')) {
    stopGameTimer();
    finishGame();
  }
}

function updateScoreBoard() {
  gameScore.innerText = CARROR_COUNT - score;

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
    let leftMove = false;
    if (Math.floor((Math.random()*2))) {
      leftMove = true;
    } 
    bugsMoveInterval.push(setInterval(() => {
      let movePx = undefined;
      const bugLeftPx = getComputedStyle(bug).left;
      const bugLeftNum = Number(bugLeftPx.slice(0, -2));
    if (leftMove) {
      if (bugLeftNum >= fieldWidth) {
        leftMove = false;
        return;
      }
      movePx = bugLeftNum + 10;
      bug.style.left = `${movePx}px`;
    } else {
      if (bugLeftNum <= 0) {
        leftMove = true;
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
