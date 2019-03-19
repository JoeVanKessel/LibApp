module.exports = function(){

var express = require('express');
var router = express.Router();

function getallbooks(context, mysql, complete){
  mysql.pool.query("SELECT DISTINCT ID, Title from Book", function(error, results, fields){
  if(!!error){
    console.log('error in query', error);
  }
  else{
  //  console.log('sucessfull query');
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


  router.post('/', function(req, res){
     //console.log("here",req.body.Title);
     var mysql = req.app.get('mysql');
     var context = {};
     var sql = "SELECT DISTINCT b.ID, Title FROM (Book b INNER JOIN Book_Authors ba ON b.ID = ba.BID INNER JOIN Author a ON ba.AID = a.ID INNER JOIN Book_Publisher bp ON b.ID = bp.BID INNER JOIN Publisher p ON bp.PID = p.ID INNER JOIN Book_Genre bg ON b.ID = bg.BID INNER JOIN Genres g ON bg.GID = g.ID) WHERE Title = ? OR (Fname = ? AND Lname = ?) OR pub_name = ? OR gen_name = ?";
     var inserts = [req.body.Title, req.body.Fname, req.body.Lname, req.body.pub_name, req.body.gen_name];
     sql = mysql.pool.query(sql, inserts, function(error, results, feilds){
       if (error){
         console.log(error);
         res.end();
       }
       else{
//Attempting to check if results are empty
    //     if (results == '[[ ]]'){
           //res.write("No Titles Matching Search");
  //         console.log("here");
        //   res.redirect('/books');
      //   }
    //     else{
           context.Book = results;
        //   console.log(context);
           res.render('books', context);
    //     }
       }
     });
  });


 return router;
 }();
