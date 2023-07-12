let i = 1;
let gradientMode = false;

function invertHex(hex) {
  return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
}

function generateRandomColor() {
  let redValue = Math.floor(Math.random() * (256));
  let redValueHex = redValue.toString(16);
  if (redValueHex.length == 1) {
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

  let oppositeColor = invertHex(redValueHex + greenValueHex + blueValueHex);

  return [colorInRgb, colorInHex, oppositeColor];
}

function setColor(element) {
  let color = generateRandomColor();
  let backgroundAndForeground = "background-color: " + color[0] + "; color:#" + color[2];
  element.setAttribute("style", backgroundAndForeground);
  element.setAttribute("data-hex", color[1]);
  element.innerHTML = "<span>" + color[1] + "</span>" + "<span class='color-name'>Loading...</span>";
  
  let rawHex = color[1].slice(1);
  fetch("https://api.color.pizza/v1/?values=" + rawHex)
    .then(response => response.json())
    .then(data => element.children[1].innerHTML = data.paletteTitle);
}

function setGradient(element) {
  let color1 = generateRandomColor();
  let color2 = generateRandomColor();
  let colorOpposites = [color1[2], color2[2]];
  element.style.background = "linear-gradient(" + color1[0] + "," + color2[0] + ")";
  element.innerHTML = "<span class='gradient-colorA' style='color:#" + colorOpposites[0] + "'>" + color1[1] + "</span><span class='color-name' id='colorA-name' style='color:#" + colorOpposites[0] + "'>Loading...</span><span class='gradient-colorB' style='color:#" + colorOpposites[1] + "'>" + color2[1] + "</span><span class='color-name' id='colorB-name' style='color:#" + colorOpposites[1] + "'>Loading...</span>";
  element.setAttribute("data-hex", color1[1] + " → " + color2[1]);

  let rawHex1 = color1[1].slice(1);
  let rawHex2 = color2[1].slice(1);
  fetch("https://api.color.pizza/v1/?values=" + rawHex1 + "," + rawHex2)
    .then(response => response.json())
    .then((data) => {
      element.children[1].innerHTML = data.colors[0].name;
      element.children[3].innerHTML = data.colors[1].name;
    })
}

function addNewColor() { // ADDS A DIV
  i++
  const newColor = document.createElement("div");
  newColor.id = "color" + i;
  newColor.className = "color";
  if (gradientMode == false) {
    setColor(newColor);
  } else {
    setGradient(newColor);
  }
  document.getElementById("wrapper").appendChild(newColor);
  return i;
}

function generatePalette() {
  for (let step = 1; step <= i; step++) {
    if (gradientMode == false) {
      setColor(document.getElementById("color" + step));
    } else {
      setGradient(document.getElementById("color" + step));
    }
  }
}

window.addEventListener("keydown", event => {
  if (event.key == " " || event.key == "r") {
    generatePalette();
  } else if (event.key == "ArrowUp") {
    addNewColor();
  } else if (event.key == "ArrowDown") {
    if (i > 1) {
      i--;
      document.getElementById("wrapper").removeChild(document.getElementById("wrapper").lastChild);
    }
  } else if (event.key == "Escape") {
    document.getElementById("wrapper").innerHTML = "";
    i = 0;
    gradientMode = false;
    addNewColor();
  } else if (event.key == "g") {
    gradientMode = !gradientMode;
    generatePalette();
  } else if (event.key == "x") {
    document.getElementById("info").style.display = "none";
  } else if (event.key == "D" && event.shiftKey) {
    html2canvas(document.querySelector("#wrapper")).then(canvas => {
      Canvas2Image.saveAsPNG(canvas);
  });
  }
});

let working = false

window.addEventListener("mousedown", event => {
  if (working) return
  working = true
  let rememberContent = event.target.innerHTML;

  if (event.target.classList.contains('color')) {
    navigator.clipboard.writeText(event.target.dataset.hex);
    event.target.innerHTML = "<span>copied!</span>";
    setTimeout(() => {
      event.target.innerHTML = rememberContent;
      working = false
    }, 1000)
  } else {
    navigator.clipboard.writeText(event.target.innerHTML);
    event.target.innerHTML = "<span>copied!</span>";
    setTimeout(() => {
      event.target.innerHTML = rememberContent;
      working = false
    }, 1000)
  }
})