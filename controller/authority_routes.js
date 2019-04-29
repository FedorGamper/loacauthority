const router = require("express").Router();
const db = require("../model/DB");
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Permission = require("../model/Permission");
const loac = require("loacprotocol").init("p192");


router.get("/", (req, res) => {
    //res.json(db.getUsers());
    res.render('index', {
        users: db.getUsers()
    });
});


router.get("/addUser", (req, res) => {
    res.render("addUser");
});

router.post("/addUser", (req, res) => {

    let username = req.body.username.toLowerCase();
    if(!/^([\w0-9._]+)$/.test(username)){
        console.log("username not valid:" +username);
        username = undefined;
    }

    let name = encodeURI(req.body.name);
    if(!/^([\w\s0-9._]+)$/.test(name)){
        console.log("name not valid:" +name);
        name = undefined;
    }

    let password = encodeURI(req.body.password);

    if (username !== undefined && name !== undefined && password !== undefined) {

            //hash the password with 10 salt rounds
            password = bcrypt.hashSync(password, 10);

            let user = new User(0, username, name, password, [], []);

            if (db.addUser(user)) {
                res.redirect("/");
            } else {
                console.log("user already exists")
            }
        } else {
            console.log("not all fields filled out");
        }
        res.redirect("/addUser");
    }

);

router.get("/addPermission", (req, res) => {
    res.render("addPermission", {
        users: db.getUsers(),
        resources: db.getResources()
    });
});

router.post("/addPermission", (req, res) => {

    let access = req.body.access;
    if(!/^([\w\s]{1,25})$/.test(access)){
        console.log("access not valid: "+ access);
        access = "no valid access";
    }

    let resource = db.findResourceByName(req.body.resource);
    let user = db.findUserByName(req.body.username.toLowerCase());
    let fromDate = loac.utils.dateToUnixTime(new Date(req.body.from));
    let untilDate = loac.utils.dateToUnixTime(new Date(req.body.until));
    let delegable = req.body.delegable === true;

    let token = pa.issueToken(user.username, delegable, resource.resourceName, fromDate, untilDate);

    let permission = new Permission(resource.name, resource.resourceName, resource.description, resource.imageUrl, access, access, token);

    if (db.addPermission(user.username, permission)) {
        res.redirect("/")
    } else {
        res.send("there was an error");
        res.redirect("/");
    }

});

module.exports = router;