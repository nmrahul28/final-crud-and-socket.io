var jobs = require('../model/model.js');
var user = require('../model/model.js');
var myenum = require('../enum_role');


exports.create = (req, res) => {
    if (!req.body) {
        res.json({ message: "Cannot be empty" });
    }
    user.user_model.find({ 'user_id': req.params.id })
        .then(response => {
            const data = new jobs.jobs_model({
                job_id: req.body.job_id,
                job_des: req.body.job_des,
                company_name: req.body.company_name,
                loc: response[0].loc
            })
            if (response[0].role == myenum.Admin) {
                data.save((err, respo) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send(respo);
                    }
                })
            }
            else if (response[0].role == myenum.Company) {
                data.save((err, respo) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send(respo);
                    }
                })
            }
            else {
                res.send({ message: 'user cannot add job' });
            }
        }).catch(err => {
            res.json({ message: err });
        })
}

exports.findAll = (req, res) => {
    // jobs.jobs_model.find((err, data) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         res.send(data);
    //     }
    // })
    var pageNo = req.params.page;
    var size = 10;
    jobs.jobs_model.count((err, total) => {
        if (err) {
            res.json({ 'message': err });
        }
        jobs.jobs_model.find((err, data) => {
            if (err) {
                res.send({ 'message': err });
            }
            else {
                var pages = Math.ceil(total / 10);
                console.log(total);
                res.json({ 'message': data, 'page': pages })
            }
        }).limit(size).skip(size * (pageNo - 1))
    })

}
exports.find_id = (req, res) => {
    jobs.jobs_model.find({ '_id': req.query.id }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    })

}

exports.deleteOne = (req, res) => {
    jobs.jobs_model.findOneAndDelete({ 'job_id': req.params.id }, (err, response) => {
        if (!response) {
            res.send({ message: "no such data" });
        }
        else if (err) {
            console.log(err);
        }
        else {
            res.send({ Message: "doc deleted successfully" });
        }
    })
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.send({
            message: "Note content can not be empty"
        });
    }

    jobs.jobs_model.update({ '_id': req.body.id }, { $set: req.body }, { new: true }, (err, response) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(response);
        }
    });
}

exports.company_jobs = (req, res) => {
    // jobs.jobs_model.find({'company_name':req.query.company_name})
    // .then((response)=>
    // {
    //     res.send(response)

    // }).catch((err)=>
    // {
    //     res.status(404).send({
    //         message: err.message || "Some error occured while Fetching Data From database"
    //     });
    // })
    var pageNo = req.params.page;
    var size = 10;
    jobs.jobs_model.count({ 'company_name': req.params.company_name }, (err, total) => {
        if (err) {
            res.json({ 'message': err });
        }
        jobs.jobs_model.find({ 'company_name': req.params.company_name }, (err, data) => {
            if (err) {
                res.send({ 'message': err });
            }
            else {
                var pages = Math.ceil(total / 10);
                console.log(total);
                res.json({ 'message': data, 'page': pages })
            }
        }).limit(size).skip(size * (pageNo - 1))
    })
}


exports.create1 = (req, res) => {
    if (!req.body) {
        res.send({ message: "Cannot be empty" });
    }
    // let role_type = req.body.role;
    // let role = myenum[role_type];
    else {
        const data = new jobs.jobs_model({
            // user_id: req.body.user_id,
            company_name: req.body.company_name,
            job_designation: req.body.job_designation,
            salary: req.body.salary,
            location: req.body.job_location
            // loc: req.body.loc
        });
        data.save().then((response) => {
            res.send(response)
        }).catch((err) => {
            res.send({ message: err });
        })
    }

}


