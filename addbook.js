module.exports = function(){
var express = require('express');
var router = express.Router();



function AddTitle(req, res, mysql, complete, titleExistsInDB){
  //console.log(req.body.Title);
  var titleID = {}
  var checkTitleExists = "SELECT ID FROM Book WHERE Title = ?";
  var sql = "INSERT INTO Book (Title) VALUES(?)";
  var inserts = [req.body.Title];
  checkTitleExists = mysql.pool.query(checkTitleExists, inserts, (error, results, feilds)=>{
    if(error){
        console.log(error);
        res.end();
    }
    else{
      if (results == ''){
        console.log("Title Doesnt Exist");
        sql = mysql.pool.query(sql, inserts, (error, results, feilds)=>{
          if (error){
            console.log(error);
            res.end();
          }
          else{
            complete();
          }
        });
      }
      else{
      //  console.log("Title Already Exists");
        titleID = results[0];
        //console.log(titleID);
        titleExistsInDB(titleID);
      }
    }
  });
  //res.end();
}

function AddAuthor(req, res, mysql, complete){
  var checkAuthorExists = "SELECT ID FROM Author WHERE Fname = ? AND Lname = ?";
  var sql = "INSERT INTO Author (Fname, Lname) VALUES(?, ?)";
  var inserts = [req.body.Fname, req.body.Lname];

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
            complete();
          }
        });
      }
      else{
      //  console.log("Author Already Exists");
        complete();
      }
    }
  });
}


function ConnectAuthorTitle(req, res, mysql, completetwo){
  var sqlBid = "SELECT ID, Title FROM Book WHERE Title = ?";
  var insertsB = [req.body.Title];
  var sqlAid = "SELECT ID, Fname, Lname FROM Author WHERE Fname = ? AND Lname = ?";
  var insertsA = [req.body.Fname, req.body.Lname];
  var bookID = {};
  var authorID = {};

  sqlBid = mysql.pool.query(sqlBid, insertsB, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
    //  console.log('here');
      bookID  = results[0];
//      console.log(bookID.ID);
      sqlAid = mysql.pool.query(sqlAid, insertsA, (error, results, feilds)=>{
        if(error){

            console.log(error);
            res.end();
          }
          else{
            authorID  = results[0];
            //console.log(authorID.ID);
            //console.log(bookID.ID);
            var inserts = [bookID.ID, authorID.ID];
            var checkBookAuthorExists = "SELECT BID, AID FROM Book_Authors WHERE BID = ? AND AID = ?";
            var sql = 'INSERT INTO Book_Authors (BID, AID) VALUES(?, ?)';
            checkBookAuthorExists = mysql.pool.query(checkBookAuthorExists, inserts, (error, results, feilds)=>{
              console.log(results);
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
                      completetwo();
                    }
                  });
                }
                else{
            //      console.log('Connection Exists');
                  completetwo();
                }
              }
            });
          }
      });
    }
  });
}



function AddPublisher(req, res, mysql, complete){
  var checkPublisherExists = "SELECT ID FROM Publisher WHERE pub_name = ?";
  var sql = "INSERT INTO Publisher (pub_name) VALUES(?)";
  var inserts = [req.body.pub_name];

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
          complete();
        }
      });
    }
    else{
    //  console.log("Author Already Exists");
      complete();
    }
  }
});
}

function ConnectPublisherTitle(req, res, mysql, completetwo){
  var sqlBid = "SELECT ID, Title FROM Book WHERE Title = ?";
  var insertsB = [req.body.Title];
  var sqlPid = "SELECT ID FROM Publisher WHERE pub_name = ?";
  var insertsP = [req.body.pub_name];
  var bookID = {};
  var publisherID = {};

  sqlBid = mysql.pool.query(sqlBid, insertsB, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
    //  console.log('here');
      bookID  = results[0];
//      console.log(bookID.ID);
      sqlPid = mysql.pool.query(sqlPid, insertsP, (error, results, feilds)=>{
        if(error){
        //  console.log(results);
            console.log(error);
            res.end();
          }
          else{
            console.log(results);
            publisherID  = results[0];
          //  console.log(publisherID.ID);
          //  console.log(bookID.ID);
            var inserts = [bookID.ID, publisherID.ID];
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
                      completetwo();
                    }
                  });
                }
                else{
                  //console.log('Connection Exists');
                  completetwo();
                }
              }
            });
          }
      });
    }
  });
}

function AddGenre(req, res, mysql, complete){
  var checkGenreExists = "SELECT ID FROM Genres WHERE gen_name = ?";
  var sql = "INSERT INTO Genres (gen_name) VALUES(?)";
  var inserts = [req.body.gen_name];

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
          complete();
        }
      });
    }
    else{
      //console.log("Genre Already Exists");
      complete();
    }
  }
});
}


function ConnectGenreTitle(req, res, mysql, completetwo, context){
  var sqlBid = "SELECT ID, Title FROM Book WHERE Title = ?";
  var insertsB = [req.body.Title];
  var sqlPid = "SELECT ID FROM Genres WHERE gen_name = ?";
  var insertsP = [req.body.gen_name];
  var bookID = {};
  var genreID = {};

  sqlBid = mysql.pool.query(sqlBid, insertsB, (error, results, feilds)=>{
    if(error){
      console.log(error);
      res.end();
    }
    else{
    //  console.log('here');
      bookID  = results[0];
//      console.log(bookID.ID);
      sqlPid = mysql.pool.query(sqlPid, insertsP, (error, results, feilds)=>{
        if(error){
        //  console.log(results);
            console.log(error);
            res.end();
          }
          else{
            //console.log(results);
            genreID  = results[0];
          //  console.log(publisherID.ID);
          //  console.log(bookID.ID);
            context.ID = bookID.ID;
            var inserts = [bookID.ID, genreID.ID];
            var checkBookGenreExists = "SELECT BID, GID FROM Book_Genre WHERE BID = ? AND GID = ?";
            var sql = 'INSERT INTO Book_Genre (BID, GID) VALUES(?, ?)';
            checkBookGenreExists = mysql.pool.query(checkBookGenreExists, inserts, (error, results, feilds)=>{
              console.log(results);
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
                      completetwo();
                    }
                  });
                }
                else{
              //    console.log('Connection Exists');
                  completetwo();
                }
              }
            });
          }
      });
    }
  });
}


function checkFeildsFull(req, res){
  if (req.body.Fname == '' || req.body.Lname =='' || req.body.Title =='' || req.body.pub_name == '' || req.body.gen_name == ''){
    return true;
  }
}

router.get('/', (req, res)=>{
  res.render('addbook');
});


router.post('/', (req, res)=>{
  var mysql = req.app.get('mysql');
  var callbackcount = 0;
  var callbackcounttwo = 0;
  var context = {};
  if (checkFeildsFull(req, res) == true){
    context.message = "You Must Fill In All Feilds";
  //  console.log(context);
    res.render('addbook', context);
  }
  else{
    AddTitle(req, res, mysql, complete, titleExistsInDB);
    AddAuthor(req, res, mysql, complete);
    AddPublisher(req, res, mysql, complete);
    AddGenre(req, res, mysql, complete);
  }
  function complete(){
    callbackcount++;
    if(callbackcount >= 4){
      ConnectPublisherTitle(req, res, mysql, completetwo);
      ConnectAuthorTitle(req, res, mysql, completetwo);
      ConnectGenreTitle(req, res, mysql, completetwo, context);
      function completetwo(){
        callbackcounttwo++;
        if (callbackcounttwo >= 3){
          context.Title = req.body.Title;
          context.message = "Added sucessfully. Cick to Update";
          res.render('addbook', context);
        }
      }
    }
  }
  function titleExistsInDB(id){
    context.Title = req.body.Title;
    context.ID = id.ID;
  //  console.log(context);
    context.message = "Title Already Exists in Database. Click to Update:";
    res.render('addbook', context);
  }
});
return router;
}();
