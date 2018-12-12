let showColon = false;
setInterval(() => document.title = (showColon = !showColon) ? document.title.replace(":", " ") : document.title.replace(" ", ":"), 1000);

// Make the DIV element draggable:
let elements = document.getElementsByClassName("tab")
for(let i = 0; i < elements.length; i++) {
    dragElement(elements[i]);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var zIndex = elmnt.style.zIndex;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    if(!e.target.classList.contains("tabheader")) {
        return;
    }
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    for(let i = 0; i < elements.length; i++) {
        if(elements[i] != elmnt)
            elements[i].style.zIndex = zIndex;
    }
    elmnt.style.zIndex = zIndex + 3;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Toggle alert tabs
$(".toggle").click(function() {
  $(".submitted").toggle();
  $(".input").val("")
});

$(".input").keydown(function(e) {
  var key = e.which;
  if (key == 13) {
    $(".submitted").toggle();
    $(".input").val("")
}
});
