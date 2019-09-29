function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

document.getElementById("adverb").innerHTML = adverb[random(100)]
document.getElementById("adjective").innerHTML = adjective[random(100)]
document.getElementById("noun").innerHTML = noun[random(100)]
