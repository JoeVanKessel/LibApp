function updateAuthorFirst(Fname, id){
  $.ajax({
    url: '/books/' + id,
    type: 'PUT',
    data: $('#update-author-first').serialize(),
    success: function(result){
      window.location.replace("./");
    }
  })
}
