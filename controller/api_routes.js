const router = require("express").Router();
//const db = require("../model/DB");
//const subject = new loac.Subject();// todo remove

router.get("/", (req, res)=>res.json({"status":"online"}));

router.post("/login", (req, res)=>{
    let request = req.body;
    //request = subject.generateOnboardingRequest(req.record.username); //todo remove
    login(request, req.record.username, res);
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
    });

module.exports = router;
module.exports.login = login;