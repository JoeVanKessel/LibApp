function deleteauthor(AID){
  $.ajax({
    type: 'DELETE',
    data: {authorID: AID, dtype: 'author'},
    success: function(result){
      window.location.reload(true);
    }
  })
};

function deletepublisher(PID){
  $.ajax({
    type: 'DELETE',
    data: {publisherID: PID, dtype: 'publisher'},
    success: function(result){
      window.location.reload(true);
    }
  })
};

function deletegenre(GID){
  $.ajax({
    type: 'DELETE',
    data: {genreID: GID, dtype: 'genre'},
    success: function(result){
      window.location.reload(true);
    }
  })
};

function deletetitle(ID){
  $.ajax({
    type: 'DELETE',
    data: {titleID: ID, dtype: 'title'},
    success: function(result){
      window.location.replace('/books');
      alert('Title Removed');
    }
  })
}
