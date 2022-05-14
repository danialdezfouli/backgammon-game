class Piece {
  constructor({ type, index }) {
    this.type = type;
    this.index = index;
    this.el = document.createElement("div");
    this.el.className = "piece";
    this.el.classList.add(type === black ? "black" : "white");

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

  findDestinationDice(dice) {
    const movement = movements[this.type];
    if (this.index === kicked_index.white) {
      return 24 - dice.value;
    } else if (this.index === kicked_index.black) {
      return dice.value - 1;
    }

    let next = this.index + dice.value * movement;

    if (next < 0 && game.turn == white) {
      if (areAllPiecesInHome(white)) {
        return dead_index.white;
      }
      return false;
    }

    if (next > 23 && game.turn == black) {
      if (areAllPiecesInHome(black)) {
        return dead_index.black;
      }
      return false;
    }

    return next;
  }

  findAvailableWays() {
    const dices = game.dices.filter((d) => d.enable);
    const result = [];

    for (const dice of dices) {
      let next = this.findDestinationDice(dice);
      if (next === false) {
        continue;
      }

      const piecesThere = game.pieces.filter((p) => p.index === next);

      if (piecesThere.length > 1 && piecesThere[0].type != this.type) {
        continue;
      }

      const point = game.points[next];

      const way = new Way({
        point,
        dice,
      });

      result.push(way);
    }

    return result;
  }

  onDragStart(e) {
    if (this.type === game.turn) {
      e.dataTransfer.setData("piece", this.getJsonData());
      const ways = this.findAvailableWays();
      game.setWays(ways);
    } else {
      e.preventDefault();
    }
  }

  onClick() {
    if (this.draggable) {
      const ways = this.findAvailableWays();
      game.setWays(ways);
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
