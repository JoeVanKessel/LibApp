var express = require('express');
var router = express.Router();
module.exports = router;



function getAuthorsByBookId(res, mysql, context, id, complete){
  var sql = 'SELECT Lname, Fname, a.ID FROM Book b INNER JOIN Book_Authors ba ON b.ID = ba.BID INNER JOIN Author a ON ba.AID = a.ID WHERE b.ID = ?';
  var inserts = [id];
  mysql.pool.query(sql,inserts, function(error, results, fields){
    if(error){
      res.end();
    }
    context.Authors = results;
    //console.log(results);
    complete();
  });
}

function getPublishersByBookId(res, mysql, context, id, complete){
  var sql = 'SELECT pub_name FROM Book b INNER JOIN Book_Publisher bp ON b.ID = bp.BID INNER JOIN Publisher p ON bp.PID = p.ID WHERE b.ID = ?';
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
  var sql = 'SELECT gen_name FROM Book b INNER JOIN Book_Genre bg ON b.ID = bg.BID INNER JOIN Genres g ON bg.GID = g.ID WHERE b.ID = ?';
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
  //  console.log()
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
  getTitleByBookId(res, mysql, context, req.params.ID, complete);
  getAuthorsByBookId(res, mysql, context, req.params.ID, complete);
  getPublishersByBookId(res, mysql, context, req.params.ID, complete);
  getGenresByBookId(res, mysql, context, req.params.ID, complete);
  //context.ID = req.params.ID;
  function complete(){
    callbackcount++;
   if(callbackcount >= 4){
    //  console.log(context);
    //console.log('Get');
    //console.log(context);
      console.log(context);
      res.render('abook',context);
    }
  }
});



router.post('/:ID', function(req, res){
  var mysql = req.app.get('mysql');
  var callbackcount = 0;
  var context = {};
//  console.log('post');
//  console.log(req.body.Fname);
  res.redirect();
});
