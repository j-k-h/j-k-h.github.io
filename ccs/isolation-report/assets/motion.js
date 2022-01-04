// HEADER

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    document.getElementById("header").style.fontSize = "0.5em";
    document.getElementById("logo").style.width = "20rem";
    // document.getElementById("header").classList.remove("i");
  } else {
    document.getElementById("header").style.fontSize = "1em";
    document.getElementById("logo").style.width = "30rem";
  }
}

// NAV

function nav() {
  var navLinks = document.getElementById("nav-links");
  if (navLinks.style.right === "0px") {
    navLinks.style.right = "-30%";
  } else {
    navLinks.style.right = "0px";
  }
}

// PAGE FADE-IN

setTimeout(function(){
  function fadeIn() {
    document.getElementById("wrapper").style.opacity = 1;
    document.getElementById("hero").style.opacity = 1;
  }
  return fadeIn();
}, 10);

//countUp

window.onload = function() {
  var options = {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
  };
  var demo = new CountUp('anxietyLevel', 0, anxietyLevel, 1, 2, options);
  if (!demo.error) {
    demo.start();
  } else {
    console.error(demo.error);
  }
};
