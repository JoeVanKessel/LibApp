
var express = require('express');
var router = express.Router();
module.exports = router;

  function getallbooks(context, mysql, complete){
    mysql.pool.query("SELECT DISTINCT ID, Title from Book", function(error, results, fields){
    if(!!error){
      console.log('error in query', error);
    }
    else{
      console.log('sucessfull query');
  //    console.log(results);
      context.Book = results;
      complete();
    }

    });
  }

  router.get('/', function(req, res){
    var callbackcount = 0;
    var context = {};
    var mysql = req.app.get('mysql');
    getallbooks(context, mysql, complete);
    function complete(){
      callbackcount++;
      if(callbackcount >= 1){
        res.render('books',context);
      }
    }
  });

  function getAuthorsByBookId(res, mysql, context, id, complete){
    var sql = 'SELECT Lname, Fname FROM Book b INNER JOIN Book_Authors ba ON b.ID = ba.BID INNER JOIN Author a ON ba.AID = a.ID WHERE b.ID = ?';
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
    var sql = 'SELECT Title FROM Book b WHERE b.ID = ?';
    var inserts = [id];
    mysql.pool.query(sql,inserts, function(error, results, fields){
      if(error){
        res.end();
      }
      context.Title = results;
      complete();
    });

  }

  router.get('/:ID', function(req, res){
    //console.log('here');
    var callbackcount = 0;
    var context = {};
    var jsscripts =["deleteFname.js"];
    var mysql = req.app.get('mysql');
    getTitleByBookId(res, mysql, context, req.params.ID, complete);
    getAuthorsByBookId(res, mysql, context, req.params.ID, complete);
    getPublishersByBookId(res, mysql, context, req.params.ID, complete);
    getGenresByBookId(res, mysql, context, req.params.ID, complete);
    function complete(){
      callbackcount++;
     if(callbackcount >= 4){
        console.log(context);
        res.render('abook',context);
      }
    }
  });



  router.post('/', function(req, res){
     //console.log("here",req.body.Title);
     var mysql = req.app.get('mysql');
     var context = {};
     var sql = "SELECT b.ID, Title FROM (Book b INNER JOIN Book_Authors ba ON b.ID = ba.BID INNER JOIN Author a ON ba.AID = a.ID) WHERE Title = ? OR (Fname = ? AND Lname = ?)";
     var inserts = [req.body.Title, req.body.Fname, req.body.Lname];
     console.log(req.body.Fname);
     sql = mysql.pool.query(sql, inserts, function(error, results, feilds){
       if (error){
         console.log(error);
         res.end();
       }
       else{
         context.Book = results;
         console.log(context);
         res.render('books', context);
       }
     });
  });
