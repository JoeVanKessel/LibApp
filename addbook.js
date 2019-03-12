var express = require('express');
var router = express.Router();
module.exports = router;

router.get('/', (req, res)=>{
  res.render('addbook');
});

router.post('/', (req, res)=>{

});
