function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

let fAdverb = adverb[random(100)];
let fAdjective = adjective[random(100)];
let fNoun = noun[random(100)];

document.getElementById("adverb").innerHTML = fAdverb;
document.getElementById("adjective").innerHTML = fAdjective;
document.getElementById("noun").innerHTML = fNoun;

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

function copy() {
  copyToClipboard(fAdverb + ' ' + fAdjective + ' ' + fNoun);
}

function party() {
  document.getElementById("rainbowBG").style.display = "block";
  document.getElementById("wrapper").style.color = "white";
  document.getElementById("credit").style.color = "white";

  document.getElementById("party").style.display = "none";
  document.getElementById("normal").style.display = "block";
}

function normal() {
  document.getElementById("rainbowBG").style.display = "none";
  document.getElementById("wrapper").style.color = "black";
  document.getElementById("credit").style.color = "black";

  document.getElementById("party").style.display = "block";
  document.getElementById("normal").style.display = "none";
}
