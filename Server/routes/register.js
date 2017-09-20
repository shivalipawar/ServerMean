
var jwt = require('jwt-simple');
var db = require('../middleware/mongoDb');
var url = 'mongodb://localhost/Employee';
var register = {
    signup: function(req, res) {
        var empId = req.body.empId || '';
        var emailId = req.body.emailId || '';
        var username = req.body.username;
        var password = req.body.password;
        var securityQues = req.body.securityQues;
        var securityAns = req.body.securityAns;
        // if (empId == '' || emailId == '') {
        //     res.status(401);
        //     res.json({
        //         "status": 401,
        //         "message": "Invalid credentials"
        //     });
        //     return;
        // }
        register.validate(empId, emailId).then(function(data) {
            if (data.length != 0) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "User already exists"
                });
            }
            else {
                var objhash = {
                    Name :username,
                    EmpId : empId,
                    EmailId: emailId,
                    Password : password,
                    securityQues : securityQues,
                    securityAns : securityAns
                }

                db.connect(url,function(err,tasks){
                    db.get().then(function(data){
                        data.collection("User").save(objhash,function(err){
                        res.status(200);
                        res.json({
                            "status": 200,
                            "message": "New User Added"
                        });
                        if(err){
                            res.send(err);
                        }
                    });
                    })
                });   
                }
            return;
            if (data) {
                res.json(genToken(data));
            }
        });
    },
    validate: function(empId, emailId) {
        var promise = new Promise(function(resolve, reject) {
            db.get().then(function(data) {
                data.collection('User').find({ EmpId: empId, EmailId: emailId }).toArray(function(err, docs) {
                    resolve(docs);
                })
            });
        });
        return promise;
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
module.exports = register;