var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { msg: '', user: req.session.user, title:'主页', success:'', error:''});
});

module.exports = router;
