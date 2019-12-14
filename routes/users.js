var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*router.get('/:username', function(req, res, next) {
  res.send('用户姓名为：' + req.params.username);
});*/

router.get('/toLogin', function(req, res, next) {
  res.send('跳转至登录页面：' + req.params.username);
});

router.post('/doLogin', function(req, res, next) {
  res.send('登录成功' + req.params.username);
});

module.exports = router;
