$(function() {
  $(".card a").animate({top: '50%', }, 750,'easeOutExpo')
  $("#prompt-title").animate({top: '1.25em', }, 750,'easeOutExpo')
})

$("a").on("click", function (e) {
  e.preventDefault();
  var goTo = this.getAttribute("href");
  $(".card a").animate({top: '150%', }, 750,'easeInExpo')
  $("#prompt-title").animate({top: '150%', }, 750,'easeInExpo')
setTimeout(function(){
     window.location = goTo;
}, 1000);
})
