var jwt = require('jwt-simple');
var db = require('../middleware/mongoDb');
var url = 'mongodb://localhost/Employee';
var auth = {
        login: function(req, res) {
            var username = req.body.username || '';
            var password = req.body.password || '';
            if (username == '' || password == '') {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
                });
                return;
            }
            auth.validate(username, password).then(function(data) {
                if (!data) {
                    res.status(401);
                    res.json({
                        "status": 401,
                        "message": "Invalid credentials"
                    });
                    return;
                }
                if (data) {
                    res.json(genToken(data));
                }
            });
        },
        validate: function(username, password) {
            var promise = new Promise(function(resolve, reject) {
                db.get().then(function(data) {
                    data.collection('User').find({ EmpId: username, Password: password }).toArray(function(err, docs) {
                        resolve(docs);
                    })
                });
            });
            return promise;
        },
        validateUser: function(username) {
            var dbUserObj = { // spoofing a userobject from the DB. 
                name: 'arvind',
                role: 'admin',
                username: 'arvind@myapp.com'
            };
            return dbUserObj;
        },
    }
    
    // private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}
module.exports = auth;