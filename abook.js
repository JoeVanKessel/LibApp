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
  context.script = ['delete.js', 'update.js'];
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

function AddAuthor(req, res, mysql, complete2){
  var checkAuthorExists = "SELECT ID FROM Author WHERE Fname = ? AND Lname = ?";
  var sql = "INSERT INTO Author (Fname, Lname) VALUES(?, ?)";
  console.log(req.body.Title);
  var inserts = [req.body.first, req.body.last];

  checkAuthorExists = mysql.pool.query(checkAuthorExists, inserts, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      if (results == ''){
        console.log("Author Doesnt Exist");
        sql = mysql.pool.query(sql, inserts, (error, results, feilds)=>{
          if(error){
            console.log(error);
            res.end();
          }
          else{
            complete2();
          }
        });
      }
      else{
      //  console.log("Author Already Exists");
        complete2();
      }
    }
  });
}

function AddPublisher(req, res, mysql, complete2){
  var checkPublisherExists = "SELECT ID FROM Publisher WHERE pub_name = ?";
  var sql = "INSERT INTO Publisher (pub_name) VALUES(?)";
  var inserts = [req.body.publisher];

  checkPublisherExists = mysql.pool.query(checkPublisherExists, inserts, (error, results, feilds)=>{
  if(error){
    console.log(error);
    res.end();
  }
  else{
    if (results == ''){
      console.log("Publisher Doesnt Exist");
      sql = mysql.pool.query(sql, inserts, (error, results, feilds)=>{
        if(error){
          console.log(error);
          res.end();
        }
        else{
          complete2();
        }
      });
    }
    else{
    //  console.log("Author Already Exists");
      complete2();
    }
  }
});
}

function ConnectPublisherTitle(req, res, mysql, complete3){
  var insertsB = [req.body.Title];
  var sqlPid = "SELECT ID FROM Publisher WHERE pub_name = ?";
  var insertsP = [req.body.publisher];
  var publisherID = {};

  sqlPid = mysql.pool.query(sqlPid, insertsP, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      //console.log(results);
      publisherID  = results[0];
          //  console.log(publisherID.ID);
          //  console.log(bookID.ID);
      var inserts = [req.body.Title, publisherID.ID];
      var checkBookPublisherExists = "SELECT BID, PID FROM Book_Publisher WHERE BID = ? AND PID = ?";
      var sql = 'INSERT INTO Book_Publisher (BID, PID) VALUES(?, ?)';
      checkBookPublisherExists = mysql.pool.query(checkBookPublisherExists, inserts, (error, results, feilds)=>{
      //  console.log(results);
      if(error){
        console.log(error);
        res.end();
      }
      else{
        if(results == ''){
          sql = mysql.pool.query(sql, inserts, (error, results, feilds)=>{
            if(error){
              console.log(error);
              res.end()
            }
            else{
              complete3();
            }
          });
        }
      }
    });
    console.log('Connection Exists');
    complete3();
    }
});
}


function ConnectAuthorTitle(req, res, mysql, complete3){
  var sqlAid = "SELECT ID, Fname, Lname FROM Author WHERE Fname = ? AND Lname = ?";
  var insertsA = [req.body.first, req.body.last];
  var authorID = {};

  sqlAid = mysql.pool.query(sqlAid, insertsA, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      authorID  = results[0];
      //console.log(authorID.ID);
      //console.log(bookID.ID);
      var inserts = [req.body.Title, authorID.ID];
      var checkBookAuthorExists = "SELECT BID, AID FROM Book_Authors WHERE BID = ? AND AID = ?";
      var sql = 'INSERT INTO Book_Authors (BID, AID) VALUES(?, ?)';
      checkBookAuthorExists = mysql.pool.query(checkBookAuthorExists, inserts, (error, results, feilds)=>{
      //console.log(results);
        if(error){
          console.log(error);
          res.end();
        }
        else{
          if(results == ''){
            sql = mysql.pool.query(sql, inserts, (error, results, feilds)=>{
              if(error){
              //console.log(results);
                console.log(error);
                res.end()
              }
              else{
                complete3();
              }
          });
        }
      }
    });
    console.log('Connection Exists');
    complete3();
  }
});
}

function AddGenre(req, res, mysql, complete2){
  var checkGenreExists = "SELECT ID FROM Genres WHERE gen_name = ?";
  var sql = "INSERT INTO Genres (gen_name) VALUES(?)";
  var inserts = [req.body.genre];

  checkGenreExists = mysql.pool.query(checkGenreExists, inserts, (error, results, feilds)=>{
  if(error){
    console.log(error);
    res.end();
  }
  else{
    if (results == ''){
      console.log("Genre Doesnt Exist");
      sql = mysql.pool.query(sql, inserts, (error, results, feilds)=>{
        if(error){
          console.log(error);
          res.end();
        }
        else{
          complete2();
        }
      });
    }
    else{
      //console.log("Genre Already Exists");
      complete2();
    }
  }
});
}


function ConnectGenreTitle(req, res, mysql, complete3){
  var insertsB = [req.body.Title];
  var sqlPid = "SELECT ID FROM Genres WHERE gen_name = ?";
  var insertsP = [req.body.genre];
  var genreID = {};


  sqlPid = mysql.pool.query(sqlPid, insertsP, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      genreID  = results[0];
      var inserts = [req.body.Title, genreID.ID];
      var checkBookGenreExists = "SELECT BID, GID FROM Book_Genre WHERE BID = ? AND GID = ?";
      var sql = 'INSERT INTO Book_Genre (BID, GID) VALUES(?, ?)';
      checkBookGenreExists = mysql.pool.query(checkBookGenreExists, inserts, (error, results, feilds)=>{
        if(error){
          console.log(error);
          res.end();
        }
        else{
          if(results == ''){
            sql = mysql.pool.query(sql, inserts, (error, results, feilds)=>{
              if(error){
                console.log(error);
                res.end()
              }
              else{
                complete3();
              }
            });
          }
        }
      });
      complete3();
    }
  });
}

function UpdateTitle(req, res, mysql, complete2){
  var sql = "UPDATE Book SET Title = ? WHERE ID = ?";
  var inserts = [req.body.Title, req.body.ID];
  mysql.pool.query(sql, inserts, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      complete2();
    }
  });
}

function UpdateAuthor(req, res, mysql, complete2){
  var sql = "UPDATE Author SET Fname = ?, Lname = ? WHERE ID = ?"
  var inserts = [req.body.first, req.body.last, req.body.ID];
  mysql.pool.query(sql, inserts, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      complete2();
    }
  });
}

function Updatepublisher(req, res, mysql, complete2){
  var sql = "UPDATE Publisher SET pub_name = ? WHERE ID = ?"
  var inserts = [req.body.publisher, req.body.ID];
  mysql.pool.query(sql, inserts, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      complete2();
    }
  });
}

function Updategenre(req, res, mysql, complete2){
  var sql = "UPDATE Genres SET gen_name = ? WHERE ID = ?";
  var inserts = [req.body.genre, req.body.ID];
  mysql.pool.query(sql, inserts, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
      complete2();
    }
  });
}

router.put('/:ID', (req, res)=>{
  var mysql = req.app.get('mysql');

  if (req.body.dtype == 'addauthor'){
    var callbackcountx = 0;
    AddAuthor(req, res, mysql, complete2);
    function complete2(){
      callbackcountx++;
      if (callbackcountx >= 1){
        ConnectAuthorTitle(req, res, mysql, complete3);
        function complete3(){
          res.end();
        }
      }
    }
  }
  else if (req.body.dtype == 'addpublisher'){
    var callbackcountx = 0;
    AddPublisher(req, res, mysql, complete2);
    function complete2(){
      callbackcountx++;
      if (callbackcountx >= 1){
        ConnectPublisherTitle(req, res, mysql, complete3);
        function complete3(){
          res.end();
        }
      }
    }
  }
  else if (req.body.dtype == 'addgenre'){
    var callbackcountx = 0;
    AddGenre(req, res, mysql, complete2);
    function complete2(){
      callbackcountx++;
      if (callbackcountx >= 1){
        ConnectGenreTitle(req, res, mysql, complete3);
        function complete3(){
        //  console.log('here');
          res.end();
        }
      }
    }
  }
  else if (req.body.dtype == 'updatetitle'){
    UpdateTitle(req, res, mysql, complete2);
    function complete2(){
      res.end();
    }
  }
  else if (req.body.dtype == 'updateauthor'){
    UpdateAuthor(req, res, mysql, complete2);
    function complete2(){
      res.end();
    }
  }
  else if (req.body.dtype == 'updatepublisher'){
    Updatepublisher(req, res, mysql, complete2);
    function complete2(){
      res.end();
    }
  }
  else if (req.body.dtype == 'updategenre'){
    Updategenre(req, res, mysql, complete2);
    function complete2(){
      res.end();
    }
  }

});

return router;
}();
