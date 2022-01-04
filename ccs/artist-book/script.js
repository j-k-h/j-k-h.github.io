var color = ["DeepPink","DarkOrange","DarkViolet","Yellow","YellowGreen","Turquoise","OrangeRed","Olive","Purple"];

var numOfColors = 2;

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

function generateComp() {
  for (i = 1; i < 10; i++) {
    let randomColor = color[random(numOfColors)];
    document.getElementById("c" + i).style.backgroundColor = randomColor;
  }
}

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 38 && numOfColors < 9) {
    numOfColors++;
    generateComp();
  }
});

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 40 && numOfColors > 2) {
    numOfColors--;
    generateComp();
  }
});

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 80) {
    window.print();
  }
});

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 67) {
    // assign random ids (c1-9) the circle class
    // add circleMode bool
  }
});

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 84) {
    // assign random ids (c1-9) the triangle class
    // add triangleMode bool
  }
});

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 82) {
    generateComp();
    // unassign AND REASSIGN random ids c1-9 the circle and triangle classes IF modes are active
  }
});

function showInstructions() {
  var instructions = document.getElementById("instructions");
  if (instructions.style.display === "none") {
    instructions.style.display = "block";
  } else {
    instructions.style.display = "none";
  }
}

window.addEventListener('keydown', function(e) {
  if (e.keyCode == 73) {
    showInstructions();
  }
});
