var MongoClient = require('mongodb').MongoClient
var url1 = 'mongodb://localhost:27017/Employee';
var state = {
    db: null,
}

exports.connect = function(url, done) {
    if (state.db) return done()

    MongoClient.connect(url, function(err, db) {
        if (err) return done(err)
        state.db = db
        done()
    })
}

exports.get = function() {
    var t = this;
    return new Promise(function(resolve, reject) {
        t.connect(url1, function() {
            resolve(state.db);
        })
    });
}

exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}