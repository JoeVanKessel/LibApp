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

function updatetitle(TID){
  var tn = document.getElementById('tn').value;
  $.ajax({
    type: 'PUT',
    data: {Title: tn, ID: TID, dtype: 'updatetitle'},
    success: function(result){
      alert('Title Updated');
      window.location.reload();
    }
  })
}

function updateauthor(AID){
  var fx = document.getElementById('fx').value;
  var lx = document.getElementById('lx').value;
  $.ajax({
    type: 'PUT',
    data: {first: fx, last: lx, ID: AID, dtype: 'updateauthor'},
    success: function(result){
      alert('Alert: Updating Author will change the Author name for all books that contained the previous Author.');
      alert('Author Updated');
      window.location.reload();
    }
  })
}

function updatepublisher(PID){
  var px = document.getElementById('px').value;
  $.ajax({
    type: 'PUT',
    data: {publisher: px, ID: PID, dtype: 'updatepublisher'},
    success: function(result){
      alert('Alert: Updating Publisher will change the Publisher name for all books that contained the previous Publisher.');
      alert('Publisher Updated');
      window.location.reload();
    }
  })
}

function updategenre(GID){
  var gx = document.getElementById('gx').value;
  $.ajax({
    type: 'PUT',
    data: {genre: gx, ID: GID, dtype: 'updategenre'},
    success: function(result){
      alert('Alert: Updating Genre will change the Genre name for all books that contained the previous Genre.');
      alert('Genre Updated');
      window.location.reload();
    }
  })
}
