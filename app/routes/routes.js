module.exports=(app)=>{
    const users_coll=require('../controllers/users.controllers.js');
    const jobs_coll=require('../controllers/job.controllers.js');
    const apply_coll=require('../controllers/apply.controllers.js');

    //user collection routes
    app.post('/users/post', users_coll.create);
    app.get('/users/read', users_coll.findAll);
    app.delete('/users/:id', users_coll.deleteOne);
    app.put('/users/put/:id', users_coll.update);
    app.post('/user/readone',users_coll.find);

    //jobs collection routes
    app.post('/jobs/post',jobs_coll.create1);
    app.get('/jobs/read/:page', jobs_coll.findAll);
    app.delete('/jobs/:id', jobs_coll.deleteOne);
    app.put('/jobs/put', jobs_coll.update);
    app.get('/jobs/:company_name/:page', jobs_coll.company_jobs);
    app.get('/jobs/find_id', jobs_coll.find_id);

    //Apply collection routes
    app.post('/apply',apply_coll.create);
    app.get('/apply/get/:id', apply_coll.distance);
    app.get('/apply/:company_name', apply_coll.findAll);
    app.get('/apply/:user_id', apply_coll.findAll_appliedjobs);
    app.get('/apply/find_applies/:user_id', apply_coll.find_applies);
    app.get('/apply/:company_name/:user_id', apply_coll.find_user);
    app.put('/apply/put', apply_coll.update1);
    app.get('/message/:user/:sender', apply_coll.get_chat);

}

