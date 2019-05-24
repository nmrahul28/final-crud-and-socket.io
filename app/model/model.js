var mongoose = require('mongoose');

var user_schema = mongoose.Schema({
    role: { type: Number, required: true },
    // user_id: { type: Number, required: true, },
    password:{type:String, required:true},
    name: { type: String, required: true },
    email: { type: String },
    mobile:{type:Number, required:true}
    // loc: {
    //     type: { type: String },
    //     coordinates: []
    // }
}, { versionKey: false });
user_schema.index({ loc: "2dsphere" });


var job_schema = mongoose.Schema({
    // job_id: { type: Number, required: true },
    job_designation: { type: String, required: true },
    company_name: { type: String, required: true },
    salary:{type:Number, required:true}
,
    // loc: {
    //     type: { type: String },
    //     coordinates: []
    // },
    location:{type:String, required:true}
}, { versionKey: false });
job_schema.index({ loc: "2dsphere" });

var Apply_schema = mongoose.Schema({
    user_id: { type: String, required: true },
    user_name:{type:String, required:true},
    job_id: { type: String, required: true },
    job_designation:{type:String, required:true},
    salary:{type:Number, required:true},
    location:{type:String, required:true},
    company_name:{type:String, required:true},
    job_status: { type: Number}
}, { versionKey: false });

var Chat_schema=mongoose.Schema({
    user:{type: String, required:true},
    sender:{type: String, required: true},
    messages:[{text:{type: String, required:true},name:{type: String, required: true}, time:{type: Date, default:Date.now, required:true}}]
}, { versionKey: false });

module.exports = {
    user_model: mongoose.model('user_types', user_schema),
    jobs_model: mongoose.model('Jobs', job_schema),
    Apply_model: mongoose.model('applies', Apply_schema),
    Chat_model: mongoose.model('Chats', Chat_schema)

}