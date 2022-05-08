class Piece {
  constructor({ type, index }) {
    this.type = type;
    this.index = index;
    this.el = document.createElement("div");
    this.el.className = "piece";
    this.el.classList.add(type === black ? "black" : "white");

    // if (dev) {
    //   this.el.textContent = index;
    // }

    this.onDragStart = this.onDragStart.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  get draggable() {
    return Boolean(this.el.draggable);
  }

  set draggable(value) {
    this.el.draggable = value;
  }

  addToPoint(bar) {
    bar.appendChild(this.el);
  }

  findAvailablePoints() {
    const dices = game.dices.filter((d) => d.enable);
    const movement = movements[this.type];
    const result = [];

    for (const dice of dices) {
      let next = 0;

      if (this.index === kicked_index.white) {
        next = 24 - dice.value;
      } else if (this.index === kicked_index.black) {
        next = dice.value - 1;
      } else {
        next = this.index + dice.value * movement;
      }

      if (next < 0 && game.turn == white) {
        if (areAllPiecesInHome(white)) {
          next = dead_index.white;
        } else {
          continue;
        }
        // console.log({ next });
      }

      if (next > 23 && game.turn == black) {
        if (areAllPiecesInHome(black)) {
          next = dead_index.black;
        } else {
          continue;
        }
      }

      const piecesThere = game.pieces.filter((p) => p.index === next);

      if (piecesThere.length > 1 && piecesThere[0].type != this.type) {
        continue;
      }

      result.push(game.points[next]);
    }

    return result;
  }

  highlightAvailblePoints(selected) {
    game.points.forEach((p) => {
      p.droppable = selected.includes(p);
    });
  }

  onDragStart(e) {
    if (this.type === game.turn) {
      e.dataTransfer.setData("piece", this.getJsonData());
      const points = this.findAvailablePoints();
      this.highlightAvailblePoints(points);
    } else {
      e.preventDefault();
    }
  }

  onClick() {
    if (this.draggable) {
      const points = this.findAvailablePoints();
      this.highlightAvailblePoints(points);
    }
  }

  getJsonData() {
    return JSON.stringify({
      index: this.index,
      type: this.type,
    });
  }

  addEventListeners() {
    resetDragEvents(this.el);
    this.el.addEventListener("dragstart", this.onDragStart);
    this.el.addEventListener("click", this.onClick);
  }

  removeEventListeners() {
    this.el.removeEventListener("dragstart", this.onDragStart);
  }

  remove() {
    this.removeEventListeners();
    this.el.remove();
  }
}
