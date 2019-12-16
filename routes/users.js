var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../modules/user');
let check = require('../filter/check');

var dbUtils = require('../modules/dbUtils');

const TABLE_NAME = 'tb_user';

const EMPTY_RESULT = {msg: ''};

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.get('/toLogin',check.checkNotLogin,  function (req, res, next) {
    res.render('login', {msg: '', user: req.session.user, title:'登录'});
});

router.post('/login', check.checkNotLogin, function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    let md5 = crypto.createHash('md5');
    password = md5.update(password).digest('base64');

    dbUtils.findOne(TABLE_NAME, {'username': username}, function (err, result) {
        if (err) {
            throw err;
        }
        if (result) {
            if (password === result.password) {
                console.log('登出成功！！')
                req.session.user = result;
                req.flash('msg', '注册成功！！');
                res.redirect('/');
            }else {
                console.log('登录失败！！！')
                req.flash('msg', '密码错误!')
                res.redirect('/users/toLogin');
            }
        }else {
            console.log('登录失败！！！')
            req.flash('msg', '用户不存在，请确认用户名是否正确!')
            res.redirect('/users/toLogin');
        }
    });
});

// 注册
router.get('/toRegister', check.checkNotLogin, function (req, res, next) {
    console.log(req.body);
    console.log(req.params);
    res.render('register', {msg: '', user: req.session.user, title:'注册'});
});

// 注册
router.post('/register', check.checkNotLogin, function (req, res, next) {
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
            req.flash('msg', '注册成功！！');
            // res.render('index', {msg: "注册成功!!", user: req.session.user});
            res.redirect('/');
        });

    });
});

router.get('/logout', check.checkLogin, function (req, res, next){
    req.session.user = null;
    req.flash('msg', '退出成功！！');
    res.redirect('/');
});

module.exports = router;
