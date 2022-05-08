class Point {
  constructor({ el, index }) {
    /** @type {HTMLElement} */
    this.el = el;
    this.index = index;
    this.addEventListeners();
  }

  onDrop(e) {
    const droppable = this.droppable;

    dom.app.classList.remove("dragging");
    game.points.forEach((p) => {
      p.unfocus();
      p.droppable = false;
    });

    if (!droppable) return;

    let data = e.dataTransfer.getData("piece");

    if (data) {
      try {
        data = JSON.parse(data);
      } catch {}
    }

    if (!data) {
      console.error("piece data was not found");
      return;
    }

    let usedDice = Math.abs(data.index - this.index);
    if (data.index === kicked_index.white) {
      usedDice--;
    } else if (data.index === kicked_index.black) {
      usedDice = this.index + 1;
    } else if (this.index === dead_index[data.type]) {
      usedDice = game.dices.find((d) => d.enable).value;
    }

    if (dev) {
      console.log(data.index, this.index, { usedDice });
    }

    game.history.push({
      dice: usedDice,
      map: JSON.parse(JSON.stringify(map)),
    });

    disableDice(usedDice);

    const [len, type] = map[this.index];
    map[data.index][0] -= 1;
    map[this.index][1] = data.type;

    if (data.type !== type && len === 1) {
      // kick piece
      const _turn = reverse_types[game.turn];
      map[this.index][0] = 1;
      map[kicked_index[_turn]][0]++;
    } else {
      map[this.index][0] += 1;
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
  }

  addEventListeners() {
    const { el } = this;

    resetDragEvents(el);

    el.addEventListener("drop", this.onDrop.bind(this));
    el.addEventListener("dragenter", () => {
      if (this.droppable) {
        this.focus();
      }
    });

    el.addEventListener("dragover", () => {
      dom.app.classList.add("dragging");
    });

    el.addEventListener("dragleave", () => {
      dom.app.classList.remove("dragging");
      this.unfocus();
    });
  }

  focus() {
    this.el.classList.add("drag-over");
  }
  unfocus() {
    this.el.classList.remove("drag-over");
  }

  get droppable() {
    return this.el.classList.contains("droppable");
  }

  set droppable(value) {
    this.el.classList.toggle("droppable", Boolean(value));
  }
}
