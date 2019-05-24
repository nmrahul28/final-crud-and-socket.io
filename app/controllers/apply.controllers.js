var apply = require('../model/model.js');
var enum_status = require('../enum_status.js');
var myenum = require('../enum_role.js');

exports.create = (req, res) => {
    var status_flag = enum_status.Pending;
    if (!req.body) {
        return res.send({ message: "Cannot be empty" });
    }
    else {
        const data = new apply.Apply_model({
            user_id: req.body.user_id,
            job_id: req.body.job_id,
            company_name: req.body.company_name,
            user_name: req.body.user_name,
            job_designation: req.body.job_designation,
            salary: req.body.salary,
            location: req.body.location,
            job_status: status_flag
        })
        data.save((err, respo) => {
            if (err) {
                console.log(err);
            }
            else {
                res.send(respo);
            }
        })
    }
}

exports.distance = (req, res) => {
    status_flag = enum_status.Applied;
    if (!req.body) {
        return res.send({ message: "Cannot be empty" });
    }
    apply.user_model.find({ 'user_id': req.params.id }).then((response) => {
        var long = response[0].loc.coordinates[0];
        var lat = response[0].loc.coordinates[1];
        apply.jobs_model.find({
            'loc':
            {
                $near:
                {
                    $geometry: { type: "Point", coordinates: [long, lat] },
                    $maxDistance: 6000
                }
            }
        }, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                res.json(data);
            }
        })
    }).catch((err) => {
        console.log(err);
    })
}

exports.findAll = (req, res) => {
    apply.Apply_model.find({ 'company_name': req.params.company_name }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    })
}

exports.find_applies = (req, res) => {
    apply.Apply_model.find({ 'user_id': req.params.user_id }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
            console.log(data);
        }
    })
}

exports.find_user = (req, res) => {
    apply.Apply_model.find({ 'company_name': req.params.company_name }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            apply.user_model.find({ 'user_id': req.params.user_id }, (err, response) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(response);
                }
            })
        }
    })
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.send({
            message: "content cannot be empty"
        });
    }
    apply.user_model.find({ 'user_id': req.params.company_id })
        .then(data => {
            if (data[0].role == myenum.Company) {
                let status = req.body.job_status;
                let change_status = enum_status[status];
                apply.Apply_model.findOneAndUpdate({ 'user_id': req.params.user }, { $set: { job_status: change_status } }, { new: true }, (err, respo) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.json(respo);
                    }
                })
            }
            else {
                res.send({ message: 'you cannot update the status' });
            }
        }).catch(err => {
            console.log(err);
        });
}

exports.update1 = (req, res) => {
    if (!req.body) {
        return res.send({
            message: "Note content can not be empty"
        });
    }
    let status = req.body.job_status;
    let change_status = enum_status[status];
    apply.Apply_model.update({ '_id': req.body.id }, { $set: { user_id: req.body.user_id, user_name: req.body.user_name, job_id: req.body.job_id, company_name: req.body.company_name, job_designation: req.body.job_designation, salary: req.body.salary, location: req.body.location, job_status: change_status } }, { new: true }, (err, response) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(response);
        }
    });
}

exports.findAll_appliedjobs = (req, res) => {
    apply.Apply_model.find({ 'user_id': req.params.user_id }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    })
}

exports.get_chat = (req, res) => {
    console.log(req.params.user, req.params.sender);
    apply.Chat_model.findOne({ 
        $and:[
            {$or: [{ 'user': req.params.user }, { 'sender': req.params.user }]}, 
            {$or: [{ 'user': req.params.sender }, { 'sender': req.params.sender }]}
        ] 
    })
    .then((data)=>{
        console.log(data);
        res.send(data);
    }).catch((err)=>{
        res.send(err);
    })
};
