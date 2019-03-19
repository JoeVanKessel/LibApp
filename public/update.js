function addauthor(TID){
  var fn = document.getElementById('fn').value;
  var ln = document.getElementById('ln').value;
  $.ajax({
    type: 'PUT',
    data: {first: fn, last: ln, Title: TID, dtype: 'addauthor'},
    success: function(result){
      alert('Author Added');
      window.location.reload();
    }
  })
};

function addpublisher(TID){
  var pn = document.getElementById('pn').value;
  $.ajax({
    type: 'PUT',
    data: {publisher: pn, Title: TID, dtype: 'addpublisher'},
    success: function(result){
      alert('Publisher Added');
      window.location.reload();
    }
  })
};

function addgenre(TID){
  var gn = document.getElementById('gn').value;
  $.ajax({
    type: 'PUT',
    data: {genre: gn, Title: TID, dtype: 'addgenre'},
    success: function(result){
      alert('Genre Added');
      window.location.reload();
    }
  })
};
