const router = require("express").Router();
//const db = require("../model/DB");
const subject = new loac.Subject();// todo remove

router.get("/", (req, res)=>res.json({"status":"online"}));

router.post("/login", (req, res)=>{
    let request = req.body;
    request = subject.generateOnboardingRequest(req.record.username); //todo remove
    console.log(request);
    login(request, req.record.username, res);
    /*
    request.username = request.username.toLowerCase();
    let user = req.record; //no need to be checked since it comes form the middleware
    try{
        let cert = ia.handleOnboaradingRequest(request, user.username);
        db.addCert(user.username, cert);
        res.json(cert);
    }

    catch (e) {
        console.log(e);
        res.status(400);
        res.json(e);
    }*/
   });

function login(request, username, res){
    request.username = request.username.toLowerCase();
    try{
        let cert = ia.handleOnboaradingRequest(request, username);
        mongo.addCert(username, cert)
            .then(res.json(cert))
            .catch(err=>{
                console.log(err);
                res.status(400);
                res.json(e);
            });

        //db.addCert(username, cert);
        //res.json(cert);
    }
    catch (e) {
        console.log(e);
        res.status(400);
        // for debug only
        res.json(e); // todo remove
    }
}

router.get("/permissions", (req, res)=>{

    res.json(req.record.permissions);
    /*
    mongo.getPermissions(req.record.username)
        .then(permissions => {
            console.log(JSON.stringify(permissions));
            res.json(permissions)
        })
        .catch(err =>{
            console.log(e);
            res.status(400);
            res.json(e);
        });

    try{

        let permissions = db.getPermissions(req.record.username);
        res.json(permissions);
    }catch (e) {
        console.log(e);
        res.status(400);
        res.json(e);
    });
    }*/
    });

module.exports = router;
module.exports.login = login;