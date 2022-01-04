$(document).ready(() => {
  $('#ok').on('click', () => {
    $('#nav-hint').fadeToggle();
  });

  $('#help').on('click', () => {
    $('#nav-hint').fadeToggle();
  });

  $('.counter').each(function() {
  var $this = $(this),
      countTo = $this.attr('data-count');

  $({ countNum: $this.text()}).animate({
    countNum: countTo
  },

  {
    duration: 2500,
    easing:'swing',
    step: function() {
      $this.text(Math.floor(this.countNum));
    },
    complete: function() {
      $this.text(this.countNum);
    }
  });
});
})
