let urlString = window.location.href;
let urlObject = new URL(urlString);
let value = urlObject.searchParams.get("ans");
console.log(decodeURI(value));

var leftAns = article[random(53)];
var rightAns = article[random(53)];
if (rightAns == leftAns) {
  rightAns = article[random(53)];
}
document.getElementById("textLeft").innerHTML = leftAns;
document.getElementById("textRight").innerHTML = rightAns;

// SELECTION ANIMATION
window.addEventListener('keydown', function(e) {
  if (e.keyCode == 37) {
    document.getElementById('left').style.backgroundColor = "white";
    document.getElementById('textLeft').style.color = "black";
  } else if (e.keyCode == 39) {
    document.getElementById('right').style.backgroundColor = "white";
    document.getElementById('textRight').style.color = "black";
  }
});

window.addEventListener('keyup', function(e) {
  if (e.keyCode == 37) {
    window.location.href = "results.html?ans=" + value + leftAns + "+";
  } else if (e.keyCode == 39) {
    window.location.href = "results.html?ans=" + value + rightAns + "+";
  }
});