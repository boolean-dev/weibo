var express = require('express');
var router = express.Router();
var User = require('../modules/user');

var dbUtils = require('../modules/dbUtils');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*router.get('/:username', function(req, res, next) {
  res.send('用户姓名为：' + req.params.username);
});*/

router.get('/toLogin', function(req, res, next) {
  res.render('login', {});
});

router.post('/doLogin', function(req, res, next) {
  console.log(req.body)
  console.log(req.params);
  res.send('登录成功,用户名=' + req.body.username + "，密码=" + req.body.password);
});

// 注册
router.get('/toRegister', function(req, res, next) {
  console.log(req.body);
  console.log(req.params);
  res.render('register', {});
  // res.send('注册成功,用户名=' + req.body.username + "，密码1=" + req.body.password1 + "，密码2=" + req.body.password2);
});

// 注册
router.post('/register', function(req, res, next) {
  console.log(req.body);
  console.log(req.params);
  console.log('注册成功,用户名=' + req.body.username + "，密码1=" + req.body.password1 + "，密码2=" + req.body.password2);
  let username = req.body.username;
  let password = req.body.password1;
  let user = new User({
    username: username,
    password: password
  });

  dbUtils.insertOne('tb_user',user, function (err, results) {
    if (err) {
      // req.flash('error', err);
      return res.redirect('/users/toRegister');
    }

    req.session.user = user;
    // req.flash('success', '注册成功');
    res.redirect('/');
  });
  /*user.save(function (err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/users/toRegister');
    }
    req.session.user = user;
    req.flash('success', '注册成功');
    res.redirect('/');
  })*/
});

module.exports = router;
