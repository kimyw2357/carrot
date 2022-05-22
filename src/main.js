'use strict'
import PopUp from './popup.js';
import { Game, Reason } from './game.js';
import * as sound from './sound.js';

const gameFinishBanner = new PopUp();
const game = new Game();
game.setGameStopListener((reason) => {
  let message;
  switch (reason) {
    case Reason.cancel:
      message = 'REPLAY❓';
      sound.playAlert();
      break;
    case Reason.lose:
      message = 'YOU LOST💥';
      sound.playBug();
      break;
    case Reason.win:
      message = 'YOU WON👍';
      sound.playWin();
      break;
    default:
      throw new Error('not valid reason');
  }
  gameFinishBanner.showWithText(message);
});
gameFinishBanner.setClickListener(() => {
  game.start();
});
