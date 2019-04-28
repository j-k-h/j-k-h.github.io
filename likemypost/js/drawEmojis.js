let emojis = [];
let shakeCount = 0;

function initShakeListener() {
  let shakeEvent = new Shake({
    threshold: 8
  });
  shakeEvent.start();

  window.addEventListener('shake', function() {
    shake();
  }, false);
}

function shake() {
  navigator.vibrate(300);
  emojis = [];
  for (let i = 0; i < Math.max((50 / (1 + Math.pow((shakeCount + 2) / 5, 5))), 1); i++) {
    emojis.push(new Emoji(Math.random(), Math.random()));
  }
  for (let emoji of emojis) {
    setTimeout(() => {
      $("#emoji-container").append(`<div class="emoji ${emoji.sprite}" data-x="${emoji.x}" data-y="${emoji.y}"></div>`);
      redrawEmojis();
    }, Math.random() * 1000);
  }
  shakeCount++;
}

function redrawEmojis() {
  $(".emoji").each((index, emoji) => {
    $(emoji).css("left", ($(emoji).attr("data-x") * window.innerWidth - 48));
    $(emoji).css("top", $(emoji).attr("data-y") * window.innerHeight - 48);
  });
}

class Emoji {
  constructor(x, y) {
    let sprites = ["one", "two", "three", "four"];
    this.x = x;
    this.y = y;
    this.sprite = sprites[Math.floor(Math.random() * sprites.length)];
  }
}
