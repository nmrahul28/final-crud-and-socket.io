var users = require('../model/model.js');
var myenum = require('../enum_role');

exports.create = (req, res) => {
    if (!req.body) {
        return res.send({ message: "Cannot be empty" });
    }
    let role_type = req.body.role;
    let role = myenum[role_type];
    const data = new users.user_model({
        role: role,
        // user_id: req.body.user_id,
        name: req.body.name,
        email: req.body.email,
        password:req.body.password,
        mobile:req.body.mobile
        // loc: req.body.loc
    });
    data.save((err, response) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(response);
        }
    })
}

exports.findAll = (req, res) => {
    users.user_model.find((err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    })

}

exports.deleteOne = (req, res) => {
    users.user_model.findOneAndDelete({ 'user_id': req.params.id }, (err, response) => {
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

    users.user_model.findOneAndUpdate({ 'user_id': req.params.id }, { $set: req.body }, { new: true }, (err, response) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(response);
        }
    });
}
exports.find = (req, res) => {
    const data = users.user_model.findOne({ 'email': req.body.email,'password':req.body.password }, (err, response) => {
        if (err) {
            console.log(data)
            res.status(404).send({
                message: err.message || "Some error occured while Fetching Data From database"
            });
        }
        else {
            res.send(response)

        }
    })

};