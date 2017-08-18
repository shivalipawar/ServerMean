var db = require('../middleware/mongodb');
var status = {
    getAll: function(req, res) {
        db.get().then(function(data) {
            data.collection('Status').find().sort({ $natural: 1 }).limit(10).toArray(
                function(err, docs) {
                    res.json(docs);
                });
        });
    },
    getByDate: function(req, res) {
        var inputDate = new Date(parseInt(req.params.date));
        var date = inputDate.getMonth() + 1 + '/' + inputDate.getDate() + '/' + inputDate.getFullYear();
        db.get().then(function(data) {
            data.collection('Status')
                .find({ "StatusDate": date })
                .toArray(function(err, docs) {
                    res.json(docs);
                });
        });
    },

    getByDateUser: function(req, res) {
        var inputDate = new Date(parseInt(req.params.date));
        var date = inputDate.getMonth() + 1 + '/' + inputDate.getDate() + '/' + inputDate.getFullYear();
        db.get().then(function(data) {
            data.collection('Status')
                .find({ "StatusDate": date })
                .toArray(function(err, docs) {
                    if (docs.length > 0 && docs[0].PersonalDetails.length > 0) {
                        docs[0].PersonalDetails.forEach(function(element) {
                            if (element.EmpId == req.params.userid) {
                                res.json(element);
                                return;
                            }
                        }, this);
                    }
                });
        });
    },
    updateStatusByUser: function(req, res) {
        console.log('test');
        var updateStatus = req.body;
        db.get().then(function(data) {
            data.collection('Status')
                .find({ "StatusDate": updateStatus.StatusDate })
                .toArray(function(err, docs) {
                    if (docs.length == 0) {
                        data.collection('Status').insertOne(updateStatus, function() {
                            res.json(true);
                            return;
                        });
                    } else {
                        var johnIndex = getIndexByProperty(docs[0].PersonalDetails, 'EmpId', updateStatus.PersonalDetails[0].EmpId);
                        if (johnIndex > -1) {
                            docs[0].PersonalDetails[johnIndex].Status = updateStatus.PersonalDetails[0].Status;
                        } else {
                            docs[0].PersonalDetails.push(updateStatus.PersonalDetails[0]);
                        }
                        data.collection('Status')
                            .update({ "StatusDate": updateStatus.StatusDate }, docs[0],
                                function() {
                                    res.json(true);
                                    return;
                                });
                    }
                });

        });
    },
};

function getIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] == value) {
            return i;
        }
    }
    return -1;
}
module.exports = status;