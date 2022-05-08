const ROLL_AGAIN_TIME = dev ? 100 : 2000;

function main() {
  initPoints(dom.quadrants);
  findTurn().then(() => {
    rollDice(game.turn);
    update();
  });
}

main();

function canPlayerMove() {
  const moveables = findMoveablePieces();
  if (moveables.length === 0) return false;

  const points = moveables[0].findAvailablePoints();

  if (points.length === 0) return false;

  return true;
}

function update() {
  message(`It's ${titles[game.turn]}'s turn`);
  clearDices();
  rollDice(game.turn);

  if (canPlayerMove()) {
    highlightMoveablePieces();
  } else {
    if (game.rollAgainCounter > 1) {
      message(`Changing Turn to ${titles[reverse_types[game.turn]]}`);
      setTimeout(changeTurn, ROLL_AGAIN_TIME);
    } else {
      game.rollAgainCounter++;
      message(`No Movements for ${titles[game.turn]} - Rolling Again`);
      setTimeout(update, ROLL_AGAIN_TIME);
    }
  }
}

function findTurn() {
  game.history = [];
  render();

  return new Promise((resolve) => {
    let timer;
    let a = 0;
    let b = 0;

    const roll = () => {
      a = rollSingleDice(white);
      b = rollSingleDice(black);

      if (a === b) {
        message("Rolling Again!");
        timer = setTimeout(() => {
          roll();
        }, ROLL_AGAIN_TIME);
      } else {
        if (a > b) {
          game.turn = white;
        } else {
          game.turn = black;
        }

        resolve();
        clearTimeout(timer);
      }
    };

    roll();
  });
}

dom.rollBtn?.addEventListener("click", (e) => {
  const { turn, pieces } = game;
  if (turn) {
    return;
  }

  map = defaultMap();
  findTurn().then(() => {
    rollDice(game.turn);
    update();
  });

  dom.rollBtn.disabled = true;
});

dom.undoBtn.addEventListener("click", (e) => {
  if (game.history.length == 0) {
    return;
  }

  const { dice, map: latest } = game.history.pop();

  map = latest;

  enableDice(dice);
  render();
  highlightMoveablePieces();
});

dom.saveBtn.addEventListener("click", (e) => {
  changeTurn();
});
