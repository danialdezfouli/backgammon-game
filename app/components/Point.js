class Point {
  constructor({ el, index }) {
    /** @type {HTMLElement} */
    this.el = el;
    this.index = index;
    this.relatedDice = null;
    this.onDropSuccess = () => {};
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

    this.onDropSuccess(data);
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
