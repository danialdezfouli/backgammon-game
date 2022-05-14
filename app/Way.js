class Way {
  /**
   * @param {Object} args
   * @param {Point} args.point
   * @param {Dice} args.dice
   */

  constructor({ point, dice }) {
    this.point = point;
    this.dice = dice;
  }

  init() {
    const { dice, point } = this;

    point.droppable = true;

    point.onDropSuccess = (data) => {
      dice.enable = false;

      game.history.push({
        dice,
        map: JSON.parse(JSON.stringify(map)),
      });

      const [len, type] = map[point.index];
      map[data.index][0] -= 1;
      map[point.index][1] = data.type;

      if (data.type !== type && len === 1) {
        // kick piece
        const _turn = reverse_types[game.turn];
        map[point.index][0] = 1;
        map[kicked_index[_turn]][0]++;
      } else {
        map[point.index][0] += 1;
      }

      render();

      const winner = findWinner();
      if (winner) {
        message(titles[winner] + " is Won! 🥳");
        game.turn = null;
        dom.saveBtn.disabled = true;
        dom.undoBtn.disabled = true;
        dom.rollBtn.disabled = false;
      } else {
        highlightMoveablePieces();
      }

      this.point.onDropSuccess = () => {};
    };
  }

  remove() {
    this.point.droppable = false;
    this.point.onDropSuccess = () => {};
  }
}
