let emojisLeft = 195;
let maxEmojis = 195;

let emojis = [];
let shakeCount = 0;

function initShakeListener() {

  $("#total-used").html(emojisLeft);
  $("#total-available").html(maxEmojis);

  let shakeEvent = new Shake({
    threshold: 15
  });
  shakeEvent.start();

  window.addEventListener('shake', function() {
    shake();
  }, false);
}

function shake() {
  if (emojisLeft <= 0) {
    if (!($("#reset").length)) {
      console.log("No more emoji! Creating reset button");
      $("body").append("<h2 id=\"reset\" onclick=\"reset()\">Post again?</h2>");
    } else {
      console.log("No more emoji, + button already exists; doing nothing");
    }
  } else {
    emojis = [];
    for (let i = 0; i < Math.max((50 / (1 + Math.pow((shakeCount + 2) / 5, 5))), 1); i++) {
      emojis.push(new Emoji(Math.random(), Math.random()));
    }
    for (let emoji of emojis) {
      setTimeout(() => {
        $("#emoji-container").append(`<div class="emoji ${emoji.sprite}" data-x="${emoji.x}" data-y="${emoji.y}"></div>`);
        emojisLeft--;
        $("#total-used").html(emojisLeft);
        redrawEmojis();
      }, Math.random() * 1000);
    }
    shakeCount++;
  }
}

function redrawEmojis() {
  $(".emoji").each((index, emoji) => {
    $(emoji).css("left", ($(emoji).attr("data-x") * window.innerWidth - 48));
    $(emoji).css("top", $(emoji).attr("data-y") * window.innerHeight - 48);
  });
}

function reset() {
  emojisLeft = 195;
  $("#total-used").html(emojisLeft);
  $("#total-available").html(maxEmojis);
  $('#reset').remove();
  shakeCount = 0;
}

class Emoji {
  constructor(x, y) {
    let sprites = ["one", "two", "three", "four"];
    this.x = x;
    this.y = y;
    this.sprite = sprites[Math.floor(Math.random() * sprites.length)];
  }
}
