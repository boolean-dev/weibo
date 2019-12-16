var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/user');

var dbUtils = require('../modules/dbUtils');

const TABLE_NAME = 'tb_user';

const EMPTY_RESULT = {msg: ''};

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
  res.render('register', EMPTY_RESULT);
  // res.send('注册成功,用户名=' + req.body.username + "，密码1=" + req.body.password1 + "，密码2=" + req.body.password2);
});

// 注册
router.post('/register', function(req, res, next) {
  console.log('注册成功,用户名=' + req.body.username + "，密码1=" + req.body.password + "，密码2=" + req.body.confirmPassword);

  let username = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  // 判断密码是否相等
  if (confirmPassword !== password) {
    return res.render('register', {
      msg: '密码不一致，请重新注册！'
    })
  }

  var md5 = crypto.createHash('md5');
  password = md5.update(password).digest('base64');
  let user = new User({
    username: username,
    password: password
  });

  dbUtils.findOne(TABLE_NAME, {'username': username}, function (err, results) {
    if (err) {
      throw err;
    }
    if (results) {
      return res.render('register', {
        msg: '用户名已存在，请重新注册！'
      })
    }

    dbUtils.insertOne(TABLE_NAME, user, function (err, results) {
      if (err) {
        throw err;
      }
      req.session.user = user;
      res.render('index', {msg: "注册成功!!"});
    });

  });
});

module.exports = router;
