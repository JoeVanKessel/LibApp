function updateall(){
  $.ajax({
    type: 'PUT',
    success: function(result){
      window.location.reload(true);
    }
  })
};
