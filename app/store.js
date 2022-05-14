const dev = false;

const black = "black";
const white = "white";
const titles = { black: "Black", white: "White" };
const reverse_types = { black: white, white: black };
const kicked_index = { black: 24, white: 25 };
const dead_index = { black: 26, white: 27 };

const home_range = {
  black: [18, 19, 20, 21, 21, 23, dead_index.black],
  white: [0, 1, 2, 3, 4, 5, dead_index.white],
};

const movements = {
  black: +1,
  white: -1,
};

const dom = {
  app: $("#app"),
  kicked: $(".kicked-wrapper"),
  dead: $(".dead-wrapper"),
  message: $(".message"),
  draggingPiece: null,

  rollBtn: $(".roll_dice_btn"),
  undoBtn: $(".undo_btn"),
  saveBtn: $(".save_btn"),

  quadrants: [
    $(".quadrant.q1"),
    $(".quadrant.q2"),
    $(".quadrant.q3"),
    $(".quadrant.q4"),
  ],

  points: [],

  dices: {
    black: $(".board.right .dices"),
    white: $(".board.left .dices"),
  },
};

let map = defaultMap();

if (dev) {
  map = [
    [1, "white"],
    [2, "white"],
    [0, "black"],
    [2, "white"],
    [2, "white"],
    [8, "white"],
    [0, "black"],
    [0, "white"],
    [0, "black"],
    [0, "black"],
    [1, "black"],
    [0, "white"],
    [1, "black"],
    [0, "white"],
    [2, "black"],
    [1, "black"],
    [4, "black"],
    [0, "black"],
    [5, "black"],
    [0, "white"],
    [0, "white"],
    [0, "white"],
    [1, "black"],
    [0, "white"],
    [0, "black"],
    [0, "white"],
    [0, "black"],
    [0, "white"],
  ];
}

function defaultMap() {
  return [
    [2, black],
    [0],
    [0],
    [0],
    [0],
    [5, white],

    [0],
    [3, white],
    [0],
    [0],
    [0],
    [5, black],

    [5, white],
    [0],
    [0],
    [0],
    [3, black],

    [0],
    [5, black],
    [0],
    [0],
    [0],
    [0],
    [2, white],

    [0, black], // 24 - black kicked
    [0, white], // 25 - white kicked

    [0, black], // 26 - black dead
    [0, white], // 27 - black dead
  ];
}
