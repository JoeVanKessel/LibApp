module.exports = function(){

var express = require('express');
var router = express.Router();

function getAuthorsByBookId(res, mysql, context, id, complete){
  var sql = 'SELECT Lname, Fname, a.ID AS AID FROM Book b INNER JOIN Book_Authors ba ON b.ID = ba.BID INNER JOIN Author a ON ba.AID = a.ID WHERE b.ID = ?';
  var inserts = [id];
  mysql.pool.query(sql,inserts, function(error, results, fields){
    if(error){
      res.end();
    }
    context.Authors = results;
    complete();
  });
}

function getPublishersByBookId(res, mysql, context, id, complete){
  var sql = 'SELECT pub_name, PID FROM Book b INNER JOIN Book_Publisher bp ON b.ID = bp.BID INNER JOIN Publisher p ON bp.PID = p.ID WHERE b.ID = ?';
  var inserts = [id];
  mysql.pool.query(sql,inserts, function(error, results, fields){
    if(error){
      res.end();
    }
    context.Publishers = results;
    complete();
  });
}

function getGenresByBookId(res, mysql, context, id, complete){
  var sql = 'SELECT gen_name, bg.GID FROM Book b INNER JOIN Book_Genre bg ON b.ID = bg.BID INNER JOIN Genres g ON bg.GID = g.ID WHERE b.ID = ?';
  var inserts = [id];
  mysql.pool.query(sql,inserts, function(error, results, fields){
    if(error){
      res.end();
    }
    context.Genres = results;
    complete();
  });
}

function getTitleByBookId(res, mysql, context, id, complete){
  var sql = 'SELECT Title, ID FROM Book b WHERE b.ID = ?';
  var inserts = [id];
  mysql.pool.query(sql,inserts, function(error, results, fields){
    if(error){
      res.end();
    }
    context.Title = results;
    context.ID = id;
    complete();
  });

}

router.get('/:ID', function(req, res){
  //console.log('here');
  var callbackcount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  context.script = ['delete.js'];
  getTitleByBookId(res, mysql, context, req.params.ID, complete);
  getAuthorsByBookId(res, mysql, context, req.params.ID, complete);
  getPublishersByBookId(res, mysql, context, req.params.ID, complete);
  getGenresByBookId(res, mysql, context, req.params.ID, complete);
  //context.ID = req.params.ID;
  function complete(){
    callbackcount++;
   if(callbackcount >= 4){
      res.render('abook',context);
    }
  }
});

function DeleteFromBookAuthor(req, mysql, authorID, complete){
  var id = req.params.ID;
  var sql = 'DELETE FROM Book_Authors WHERE AID = ? AND BID = ?';
  var inserts = [authorID, id];
  mysql.pool.query(sql, inserts, function(error, results, feilds){
    if(error){
      console.log(error);
      res.end();
    }

  });
  complete();
}

function DeleteFromBookPublisher(req, mysql, publisherID, complete){
  var id = req.params.ID;
  var sql = 'DELETE FROM Book_Publisher WHERE PID = ? AND BID = ?';
  var inserts = [publisherID, id];
  mysql.pool.query(sql, inserts, function(error, results, feilds){
    if(error){
      console.log(error);
    }

  });
  complete();
}

function DeleteFromBookGenre(req, mysql, genreID, complete){
  var id = req.params.ID;
  var sql = 'DELETE FROM Book_Genre WHERE GID = ? AND BID = ?';
  var inserts = [genreID, id];
  mysql.pool.query(sql, inserts, function(error, results, feilds){
    if(error){
      console.log(error);
    }

  });
  complete();
}

function DeleteTitle(req, mysql, titleID, completex){
//  var id = req.params.ID;
  var deletefrgnkeys = 'DELETE ba, bp, bg FROM Book_Authors ba INNER JOIN Book_Publisher bp ON ba.BID = bp.BID INNER JOIN Book_Genre bg ON bp.BID = bg.BID WHERE ba.BID = ?';
  var deletetitle = 'DELETE FROM Book WHERE ID = ?'
  var inserts = [titleID];
  mysql.pool.query(deletefrgnkeys, inserts, function(error, results, feilds){
    if(error){
      console.log(error);
    }
    mysql.pool.query(deletetitle, inserts, function(error, results, feilds){
      if(error){
        console.log(error);
      }
    //  console.log(results);
    });
  });
completex();

}

router.delete('/:ID', (req, res)=>{
  var mysql = req.app.get('mysql');
  var callbackcount = 0;
  var callbackcount2 = 0;
  var context = {};

  if (req.body.dtype == 'title'){
    DeleteTitle(req, mysql, req.body.titleID, completex);
    console.log('here');
    function completex(){
      callbackcount2++;
      //res.alert('Book removed');
    //  res.render('books');

      res.end();
    }
  }
  else if (req.body.dtype == 'author'){
    DeleteFromBookAuthor(req, mysql, req.body.authorID, complete);
  }
  else if (req.body.dtype == 'publisher'){
    DeleteFromBookPublisher(req, mysql, req.body.publisherID, complete);
  }
  else if (req.body.dtype == 'genre'){
    DeleteFromBookGenre(req, mysql, req.body.genreID, complete);
  }
  //  console.log(req.body.Fname);
  function complete(){
    context.script = ['delete.js'];
    getTitleByBookId(res, mysql, context, req.params.ID, completex);
    getAuthorsByBookId(res, mysql, context, req.params.ID, completex);
    getPublishersByBookId(res, mysql, context, req.params.ID, completex);
    getGenresByBookId(res, mysql, context, req.params.ID, completex);
    function completex(){
      callbackcount++;
     if(callbackcount >= 4){
        res.render('abook',context);
      }
    }
  }
});


router.put(':/ID', (req, res)=>{
  var mysql = req.app.get('mysql');
  var callbackcount = 0;
  var context = {};
});

return router;
}();
