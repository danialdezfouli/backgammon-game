/** @returns {HTMLElement} */
function $(s) {
  return document.querySelector(s);
}
/** @returns {HTMLElement[]} */
const $$ = (s) => Array.from(document.querySelectorAll(s));

function resetDragEvents(el) {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((name) => {
    el.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

function areAllPiecesInHome(turn) {
  const range = home_range[turn];

  return !game.pieces.some((p) => {
    return p.type === turn && !range.includes(p.index);
  });
}

function findWinner() {
  for (const type of [black, white]) {
    const won = !game.pieces.some(
      (p) => p.type === type && p.index !== dead_index[type]
    );
    if (won) {
      return type;
    }
  }

  return false;
}

const randomDice = () => 1 + Math.floor(Math.random() * 6);

function rollSingleDice(turn) {
  const value = randomDice();
  const dice = new Dice(value);
  game.dices = [dice];

  dom.dices[turn].innerHTML = "";
  dice.appendTo(dom.dices[turn]);

  return value;
}

function rollDice(turn) {
  const a = randomDice();
  const b = randomDice();

  let result = [a, b];

  if (a === b) {
    result = [a, a, a, a];
  }

  dom.dices[turn].innerHTML = "";
  game.dices = [];

  for (const value of result) {
    const dice = new Dice(value);
    dice.appendTo(dom.dices[turn]);
    game.dices.push(dice);
  }

  return result;
}

function message(msg) {
  dom.message.innerHTML = msg;
}

function clearMessage() {
  dom.message.innerHTML = "";
}

function findMoveablePieces() {
  const ki = kicked_index[game.turn];
  const [kickedLen] = map[ki];

  if (kickedLen > 0) {
    return game.pieces.filter((p) => p.index === ki);
  }

  return game.pieces.filter((p) => {
    if (p.type === game.turn && p.index !== dead_index[p.type]) {
      const ways = p.findAvailableWays();
      if (ways.length > 0) {
        return true;
      }
    }

    return false;
  });
}

function highlightMoveablePieces() {
  const moveables = findMoveablePieces();

  game.pieces.forEach((p) => {
    const active = moveables.includes(p);
    const highlighted = active && p.el === p.el.parentNode.lastChild;

    p.draggable = active;
    p.el.classList.toggle("highlight", highlighted);
  });
}
