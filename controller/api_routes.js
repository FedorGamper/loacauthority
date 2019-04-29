const router = require("express").Router();
const loac = require("loacprotocol").init("p192");
const db = require("../model/DB");
const secret = require("../.secret.json");


router.get("/", (req, res)=>res.json({"status":"online"}));

router.post("/login", (req, res)=>{
    let request = req.body;
    request.username = request.username.toLowerCase();
    console.log(request);
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
    }
   });


router.get("/permissions", (req, res)=>{
    try{
        let permissions = db.getPermissions(req.record.username);
        res.json(permissions);
    }catch (e) {
        console.log(e);
        res.status(400);
        res.json(e);
    }
    });

module.exports = router;