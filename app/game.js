class Game {
  constructor() {
    this.turn = null;
    this.points = [];
    this.rollAgainCounter = 0;
    this.dices = [];
    /** @type {Piece[]} */
    this.pieces = [];
    this.history = [];
    this.ways = [];
  }

  changeTurn() {
    this.history = [];
    this.rollAgainCounter = 0;
    this.turn = reverse_types[this.turn];
    render();
    update();
  }

  setWays(ways) {
    this.ways.forEach((way) => {
      way.remove();
    });

    ways.forEach((way) => {
      way.init();
    });

    this.ways = ways;
  }
}

const game = new Game();
