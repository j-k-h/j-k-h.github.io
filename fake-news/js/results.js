let urlString = window.location.href;
let urlObject = new URL(urlString);
let value = urlObject.searchParams.get("ans");
console.log(decodeURI(value));
let result = decodeURI(value);
let resultAll = result.split(" ");
resultAll.pop();

document.getElementById("logo").src = source[random(8)];

document.getElementById("result").innerHTML = time[random(22)] + " " + resultAll[0] + " " + participialAdjective[random(14)] + " " + resultAll[3] + " " + preposition[random(6)] +
" " + resultAll[2] + " " + number[random(14)] + " " + resultAll[1];

window.addEventListener('keyup', function(e) {
  if (e.keyCode == 37 || e.keyCode == 39) {
    window.location.href = "../index.html";
  }
});

let timestamp = new Date();
document.getElementById("timestamp").innerHTML = timestamp.toLocaleString();


setTimeout(function(){
           window.location.href = "../index.html";
        }, 15000);
