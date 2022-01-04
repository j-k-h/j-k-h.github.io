// RESIZE COLUMNS

let currentHandle = null;
let mouseStartX = null;
let mouseX = null;

let columns = document.querySelectorAll(".medium");
let handles = document.querySelectorAll(".handle");
let iframes = document.querySelectorAll("iframe");

handles.forEach(handle => {
  handle.onmousedown = event => {
    currentHandle = event.target;
    mouseStartX = event.clientX;
	iframes.forEach(iframe => iframe.style = "pointer-events: none");
  };
});

document.onmouseup = event => {
	currentHandle = null;
	iframes.forEach(iframe => iframe.style = "pointer-events: all");
};
document.onmousemove = event => mouseX = event.clientX;

function update() {
  if(currentHandle !== null) {

    // we are holding a handle, resize the columns
    let handleIndex = [].indexOf.call(handles, currentHandle);
    let expandingColumn = columns[handleIndex];
    let shrinkingColumn = columns[handleIndex + 1];

    expandingColumn.style = `width: calc(20% + ${mouseX - mouseStartX }px)`;
	shrinkingColumn.style = `width: calc(20% - ${mouseX - mouseStartX}px)`;

  }
  requestAnimationFrame(update); // calls update() once per frame (preferred over setInterval for browser optimisation when in background)
}
update();

// IMG ON HOVER
document.querySelectorAll('.example').forEach(example => {
  const imageElement = example.querySelector('.image-element');

  example.querySelector('p').addEventListener('mouseover', e => {
    imageElement.classList.add('visible');
  });

  // example.querySelector('p').addEventListener('mousemove', follow);
  //
  // function follow() {
  //   var el = example.querySelector('.image-element');
  //   el.style.top = (event.clientY + window.scrollY + 20) + "px";
  //   el.style.left = (event.clientX + window.scrollX - 150) + "px";
  // }
  example.querySelector('p').addEventListener('mouseout', e => {
    imageElement.classList.remove('visible');
  });
});
