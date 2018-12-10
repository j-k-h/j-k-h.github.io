// SCROLL
$('.marquee').marquee({
  direction: 'left'
});

// MENU
$(".menu-icon").click(function() {
  $(".menu").toggle();
  $(".menu-close").toggle();
  $(".menu-icon").toggle();
});

$(".menu-close").click(function() {
  $(".menu").toggle();
  $(".menu-close").toggle();
  $(".menu-icon").toggle();
});
