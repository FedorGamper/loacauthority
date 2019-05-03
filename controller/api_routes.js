const router = require("express").Router();

router.post("/login", (req, res)=>{
    let request = req.body;
    let username = req.record.username;
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
});


router.get("/permissions", (req, res)=>{
    res.json(req.record.permissions);
    });

module.exports = router;