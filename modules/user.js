var mongodb = require('./db');

function User(user) {
    this.username = user.username;
    this.password = user.password;
}

module.exports = User;

User.prototype.save = function save(callback) {
    // 存入数据库
    var user = {
        username: this.username,
        password: this.password
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        };

        // 读取数据库
        db.collation('db_user', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.ensureIndex('username', {unique: true});

            collection.insert(user, {saft: true}, function (err, user) {
                mongodb.close();
                callback(err, user);
            });

        });
    });

};