function render() {
  clearBoard();

  const mapLength = map.length;
  for (let i = 0; i < mapLength; i++) {
    if (typeof map[i] === "undefined") {
      throw new Error("index " + i + " was not found in map");
    }

    const [len, type] = map[i];

    if (len > 0) {
      const fragment = document.createDocumentFragment();
      createPeices(fragment, map, i);
      dom.points[i].appendChild(fragment);
    }
  }

  Object.values(kicked_index).forEach((index, i) => {
    if (map[index].len > 0) {
      const bar = dom.kicked[i];
      createPeices(bar, map, index);
    }
  });

  dom.undoBtn.disabled = game.history.length === 0;
  dom.saveBtn.disabled = game.history.length === 0;
}

function clearBoard() {
  const { pieces } = game;
  for (let p of pieces) {
    p.remove();
  }
  game.pieces = [];
}

function createPeices(point, map, index) {
  const [len, type] = map[index];

  for (let counter = 0; counter < len; counter++) {
    const piece = new Piece({ type, index });
    game.pieces.push(piece);
    piece.addToPoint(point);
    piece.addEventListeners();

    if (len > 5 && counter === 4) {
      piece.el.innerHTML = `<small>x</small> ${len}`;
      break;
    }
  }
}

function initPoints(quadrants) {
  game.points = [];

  let index = 0;
  function createPoint(parent) {
    const el = document.createElement("div");
    el.className = "point";
    const point = new Point({ el, index });

    parent.appendChild(el);
    dom.points[index] = el;
    game.points[index] = point;
    index++;
  }

  for (const home of quadrants) {
    for (let i = 0; i < 6; i++) {
      createPoint(home);
    }
  }

  createPoint(dom.kicked);
  createPoint(dom.kicked);
  createPoint(dom.dead);
  createPoint(dom.dead);
}

function clearDices() {
  dom.dices.black.innerHTML = "";
  dom.dices.white.innerHTML = "";
}
