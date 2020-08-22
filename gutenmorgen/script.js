var time = ["7:14","7:56","7:57","7:58","7:59","8:00","8:01","8:02","8:03","8:04","8:05","8:06","8:07","8:08","8:09","8:10","8:11","8:12","8:13","8:14","8:15","8:16","8:17","9:05"];
var text = ["Helllooooo","Good morning <span class='emoji'>👋</span>","Am I late?","One sec, gotta get some <span class='emoji'>☕</span>","Guten Morgen","Bonjour","Buongiorno","<span class='emoji'>👽👽👽</span>","<span class='emoji'>👁👄👁</span> morning","hallo","goood mornin","<span class='emoji'>🤠</span> Howdy","whereby?","<span class='emoji'>🌞</span> mornin!","hewwo","how do you use wordpress","g'mornin","ellooo <span class='emoji'>🍳🥓☕</span>","<span class='emoji'>👋</span> hiya","<span class='emoji'>👋👋</span> ","<span class='emoji'>😴</span> good morning","hey!","yo yo!","hellloooo <span class='emoji'>🥞</span>","hallo","how does docker work","hi <span class='emoji'>☕🐸</span>","why isn't flexbox working","where am I","did I oversleep?","ping me!","<span class='emoji'>🤯</span>"];

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

function generateMessage() {
  let timestamp = time[random(24)];
  let message = text[random(32)];

  document.getElementById("timestamp").innerHTML = timestamp;
  document.getElementById("message").innerHTML = message;
}

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 82) {
    generateMessage();
  }
});

document.querySelectorAll('.suprise').forEach(suprise => {
  const imageElement = suprise.querySelector('.image-element');

  suprise.querySelector('a').addEventListener('mouseover', e => {
    imageElement.classList.add('visible');
  });

  suprise.querySelector('a').addEventListener('mousemove', follow);

  function follow() {
    var el = suprise.querySelector('.image-element');
    el.style.top = (event.clientY + window.scrollY + 20) + "px";
    el.style.left = event.clientX + "px";
  }
  suprise.querySelector('a').addEventListener('mouseout', e => {
    imageElement.classList.remove('visible');
  });
});
