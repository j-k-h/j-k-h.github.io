$('#info-confirm').on('click',() => {
  $('#info-bar').toggle();
});

$('#add').on('click',() => {
  $('#inputs').append('<input placeholder="name@example.com" />');
});

$('.buy').on('click',() => {
  alert('Added to cart!')
});
