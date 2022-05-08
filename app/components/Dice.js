class Dice {
  constructor(value = 0) {
    this.value = value;

    this.el = document.createElement("div");
    this.el.className = "dice dice-" + value;

    for (let i = 0; i < value; i++) {
      const span = document.createElement("span");
      this.el.appendChild(span);
    }
  }

  appendTo(parent) {
    parent.appendChild(this.el);
  }

  get enable() {
    return !this.el.classList.contains("disabled");
  }

  set enable(value = false) {
    return this.el.classList.toggle("disabled", !value);
  }
}
