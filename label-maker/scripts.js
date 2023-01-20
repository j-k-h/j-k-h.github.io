// COLOR
function setTheme() {
  var themes = [
    ["#9BEFE2", "invert(11%) sepia(87%) saturate(7340%) hue-rotate(261deg) brightness(81%) contrast(129%)"], // aqua blue, gobalt blue
    ["#3C00E4", "invert(86%) sepia(39%) saturate(317%) hue-rotate(110deg) brightness(99%) contrast(89%)"], // gobalt blue, aqua blue
    ["#C0AFD0", "invert(11%) sepia(87%) saturate(7340%) hue-rotate(261deg) brightness(81%) contrast(129%)"], // laughin lilac
    ["#CFF469", "invert(19%) sepia(28%) saturate(930%) hue-rotate(241deg) brightness(95%) contrast(83%)"], // lime green, midnight purple
    ["#22306D", "invert(94%) sepia(26%) saturate(563%) hue-rotate(59deg) brightness(99%) contrast(87%)"], // marine blue, minty green
    ["#503658", "invert(78%) sepia(27%) saturate(673%) hue-rotate(327deg) brightness(93%) contrast(92%)"], // midnight purple, salmon orange
    ["#ABEDBB", "invert(15%) sepia(38%) saturate(2706%) hue-rotate(212deg) brightness(98%) contrast(94%)"], // minty green, marine blue
    ["#F36EBD", "invert(15%) sepia(38%) saturate(2706%) hue-rotate(212deg) brightness(98%) contrast(94%)"], // pretty pink, marine blue
    ["#E5AB8A", "invert(20%) sepia(16%) saturate(1513%) hue-rotate(241deg) brightness(95%) contrast(86%)"], // salmon orange, midnight purple
    ["#E91229", "invert(88%) sepia(6%) saturate(855%) hue-rotate(306deg) brightness(97%) contrast(101%)"], // screamin red, soft pink
    ["#F8D4D7", "invert(29%) sepia(79%) saturate(7430%) hue-rotate(345deg) brightness(90%) contrast(103%)"] // soft pink, screamin red
  ];

  var theme = themes[Math.floor(Math.random() * themes.length)];
  let foreground = theme[1];
  let background = theme[0];

  document.body.style.backgroundColor = background;
  document.documentElement.style.setProperty('--foreground', foreground);
}

window.addEventListener("keydown", event => {
  // ALPHABET

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (let i = 0; i < alphabet.length; i++) {
    let letterKeycode = i + 65;
    if (letterKeycode == event.keyCode) {
      var letterLoop = alphabet[i];
      var newLetter = document.createElement("div");
      newLetter.classList.add('letter');
      newLetter.style.backgroundImage = "url('chars/" + letterLoop + ".svg')";

      document.getElementById("wrapper").appendChild(newLetter);
    }
  }

  // NUMBERS
  const numbers = "0123456789".split("");
  for (let i = 0; i < numbers.length; i++) {
    let letterKeycode = i + 48;
    if (letterKeycode == event.keyCode && event.shiftKey == false) {
      var letterLoop = numbers[i];
      var newLetter = document.createElement("div");
      newLetter.classList.add('letter');
      newLetter.style.backgroundImage = "url('chars/" + letterLoop + ".svg')";

      document.getElementById("wrapper").appendChild(newLetter);
    }
  }

  // SYMBOLS
  const shiftSymbols = [
    ["(", "l-parentheses", 57],
    [")", "r-parentheses", 48],
    ["!", "exclaimation", 49],
    ["@", "at", 50],
    ["#", "num", 51],
    ["$", "dollar", 52],
    ["%", "percent", 53],
    ["^", "caret", 54],
    ["&", "ampersand", 55],
    ["*", "asterisk", 56],
    ["?", "questionmark", 191],
    [":", "colon", 186],
    ["+", "plus", 187],
    ["_", "underscore", 189],
    [">", "greaterthan", 190],
    ["<", "lessthan", 188],
    ["", "quote", 222],
  ];

  for (let i = 0; i < shiftSymbols.length; i++) {
    let symbolKeycode = shiftSymbols[i][2];
    if (symbolKeycode == event.keyCode && event.shiftKey == true) {
      var newSymbol = document.createElement("div");
      newSymbol.classList.add('letter');
      newSymbol.style.backgroundImage = "url('chars/" + shiftSymbols[i][1] + ".svg')";

      document.getElementById("wrapper").appendChild(newSymbol);
    }
  }

  const symbols = [
    [".", "period", 190],
    ["-", "dash", 189],
    ["/", "slash", 191],
    [`\\`, "backslash", 220],
    ["=", "equals", 187],
    ["", "singlequote", 222],
  ];

  for (let i = 0; i < symbols.length; i++) {
    let symbolKeycode = symbols[i][2];
    if (symbolKeycode == event.keyCode && event.shiftKey == false) {
      var newSymbol = document.createElement("div");
      newSymbol.classList.add('letter');
      newSymbol.style.backgroundImage = "url('chars/" + symbols[i][1] + ".svg')";

      document.getElementById("wrapper").appendChild(newSymbol);
    }
  }

  // SPACE
  if (event.keyCode == 32) {
    var newSpace = document.createElement("div");
    newSpace.classList.add('letter');
    newSpace.style.backgroundImage = "url('chars/space.svg')";

    document.getElementById("wrapper").appendChild(newSpace);
  }

  // DELETE
  if (event.keyCode == 8) {
    var select = document.getElementById("wrapper");
    select.removeChild(select.lastChild);
  }

  // ENTER
  if (event.keyCode == 13) {
    document.getElementById("wrapper").innerHTML = "";
    setTheme();
  }
});
