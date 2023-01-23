let i = 1;

function generateRandomColor() {
  let redValue = Math.floor(Math.random() * (256));
  let redValueHex = redValue.toString(16);
  if (redValueHex.length == 1){
    redValueHex = "0" + redValueHex;
  }

  let greenValue = Math.floor(Math.random() * (256));
  let greenValueHex = greenValue.toString(16);
  if (greenValueHex.length == 1) {
    greenValueHex = "0" + greenValueHex;
  };

  let blueValue = Math.floor(Math.random() * (256));
  let blueValueHex = blueValue.toString(16);
  if (blueValueHex.length == 1) {
    blueValueHex = "0" + blueValueHex;
  };

  let colorInRgb = "rgb(" + redValue + ", " + greenValue + ", " + blueValue + ")";
  let colorInHex = "#" + redValueHex + greenValueHex + blueValueHex;

  return [colorInRgb, colorInHex];
}

function setColor(element) {
  let color = generateRandomColor();
  element.style.backgroundColor = color[0];
  element.innerHTML = "<span>" + color[1] + "</span>" + "<span id='color-name'>Loading...</span>";
  element.setAttribute("data-hex", color[1]); 

  let rawHex = color[1].slice(1);
  fetch("https://api.color.pizza/v1/?values=" + rawHex)
    .then(response => response.json())
    .then(data => element.children[1].innerHTML = "<span>" + data.paletteTitle + "</span>");
}

function addNewColor() { // ADDS A DIV
  i++
  const newColor = document.createElement("div");
  newColor.id = "color" + i;
  newColor.className = "color";
  setColor(newColor);
  document.getElementById("wrapper").appendChild(newColor);
  return i;
}

function generatePalette() { // GENERATES COLORS FOR ALL DIVS
  for (let step = 1; step <= i; step++) {
    setColor(document.getElementById("color" + step));
  }
}

window.addEventListener("keydown", event => {
  if (event.key == "r") {
    generatePalette();
  } else if (event.key == "ArrowUp") {
    addNewColor();
  } else if (event.key == "ArrowDown") {
    if (i > 0) {
      i--;
      document.getElementById("wrapper").removeChild(document.getElementById("wrapper").lastChild);
    }
  } else if (event.key == "Escape") {
    document.getElementById("wrapper").innerHTML = "";
    addNewColor();
  }
});

window.addEventListener("mousedown", event => {
  let rememberContent = event.target.innerHTML;
  navigator.clipboard.writeText(event.target.dataset.hex);
  event.target.innerHTML = "<span>copied!</span>";
  setTimeout(() => {
    event.target.innerHTML = rememberContent;
  }, 1000)
})