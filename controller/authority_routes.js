const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Permission = require("../model/Permission");


router.get("/", (req, res) => {
    mongo.allUsers()
        .then(users => {
          res.render('index', {
                    users: users
                });
            }
        ).catch(err=>console.log(err));
});


router.get("/manageUser", (req, res) => {
    mongo.allUsers()
        .then((users)=>{
            res.render('manageUser', {
                users: users
            });
        }).catch(err=>console.log(err))

});


router.post("/addUser", (req, res) => {

        let username = req.body.username.toLowerCase();
        if (!/^([\w0-9._]+)$/.test(username)) {
            console.log("username not valid:" + username);
            username = undefined;
        }

        let name = req.body.name;
        if (!/^([\w\s0-9._]+)$/.test(name)) {
            console.log("name not valid:" + name);
            name = undefined;
        }

        let password = encodeURI(req.body.password);

        if (username !== undefined && name !== undefined && password !== undefined) {

            //hash the password with 10 salt rounds
            password = bcrypt.hashSync(password, 10);

            let user = new User(0, username, name, password, [], []);

            mongo.addUser(user)
                .then(() => {
                    res.redirect("/");
                })
                .catch(err => console.log(err));

        } else {
            console.log("not all fields filled out");
            res.redirect("/manageUser");
        }

    }
);

router.post("/deleteUser", (req, res)=>{
    if(req.body.username !== undefined){
        mongo.deleteUser(req.body.username)
            .then(()=>res.redirect("/"))
            .catch(err=>{
                console.log(err);
                res.redirect("/manageUser")
            });
    }
    else{
        console.log("no username was given");
        res.redirect("/manageUser");
    }
});

router.get("/addPermission", (req, res) => {
    Promise.all([mongo.allResources(), mongo.allUsers()])
        .then(([resources, users]) => {
            res.render("addPermission", {
                users: users,
                resources: resources
            })
        })
        .catch(err => console.log(err))
    ;

});

router.post("/addPermission", (req, res) => {

    let access = req.body.access;
    if (!/^([\w\s]{1,25})$/.test(access)) {
        console.log("access not valid: " + access);
        access = "no valid access";
    }

    let fromDate = loac.utils.dateToUnixTime(new Date(req.body.from));
    let untilDate = loac.utils.dateToUnixTime(new Date(req.body.until));
    let delegable = req.body.delegable === true;


    Promise.all([mongo.findUser(req.body.username), mongo.findResource(req.body.resource)])
        .then(([user, resource]) => {
            let token = pa.issueToken(user.username, delegable, resource.resourceName, fromDate, untilDate);
            let permission = new Permission(resource.name, resource.resourceName, resource.description, resource.imageUrl, access, access, token);
            mongo.addPermission(user.username, permission);
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.redirect("/addPermission");
        });
});

module.exports = router;