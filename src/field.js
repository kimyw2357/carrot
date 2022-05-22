'use strict'
import * as sound from './sound.js';
const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug'
});

export class Field {
  constructor() {
    this.bugsMoveInterval = [];
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', this.onClick);
  }

  init(carrotCount, bugCount) {
    this.field.innerHTML = '';
    this.addItem('carrot', carrotCount, 'img/carrot.png');
    this.addItem('bug', bugCount, 'img/bug_left.png');
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  addItem (className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;;
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  onClick = event => {
    const target = event.target;
    if (target.matches('.carrot')) {
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches('.bug')) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  }
  
  get carrotSize() {
    return CARROT_SIZE;
  }
  get fieldRectWidth() {
    return this.fieldRect.width
  }

  moveBugs() {
    const bugs = document.querySelectorAll('.bug');
    const fieldWidth = this.fieldRect.width - CARROT_SIZE;
    bugs.forEach(bug => {
      let rightMove = false;
      if (Math.floor((Math.random()*2))) {
        rightMove = true;
        bug.src = 'img/bug_right.png';
      } 
      this.bugsMoveInterval.push(setInterval(() => {
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

  bugsMoveClearInterval() {
    this.bugsMoveInterval.forEach(bug => {
      clearInterval(bug);
    })
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}