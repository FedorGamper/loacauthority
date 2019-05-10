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

        let username = req.body.username;
        if (!/^([\w0-9._]+)$/.test(username)) {
            console.log("username not valid:" + username);
            username = undefined;
        }

        let name = req.body.name;
        if (!/^([\w\s0-9._]+)$/.test(name)) {
            console.log("name not valid:" + name);
            name = undefined;
        }

        let password = req.body.password;

        if (username !== undefined && name !== undefined && password !== undefined) {
            //hash the password with 10 salt rounds
            let salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);

            let user = new User(0, username, name, password, [], []);

            mongo.addUser(user)
                .then(() => {
                    res.redirect("/");
                })
                .catch(err => console.log(err));

        } else {
            console.log("not all fields filled out");
            res.status(400);
            res.send("not all fields filled out");
        }

    }
);

router.post("/deleteUser", (req, res)=>{
    if(req.body.username !== undefined){
        mongo.deleteUser(req.body.username)
            .then((result)=>{
                console.log(result);
                if(result.n === 0){ res.status(400); res.send("no user was deleted"); res.end()}
                else{res.redirect("/");}
            })
            .catch(err=>{
                console.log("user not found\n\n" +err);
                res.status(400);
                res.send("user not found\n\n" +err);
                res.end();
            });
    }
    else{
        console.log("no username was given");
        res.status(400);
        res.send("no username was given")
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
    let delegable = req.body.delegable == 1;


    Promise.all([mongo.findUser(req.body.username), mongo.findResource(req.body.resource)])
        .then(([user, resource]) => {
            let token = pa.issueToken(user.username, delegable, resource.resourceName, fromDate, untilDate);
            let permission = new Permission(resource.name, resource.resourceName, resource.description, resource.imageUrl, access, access, token);
            mongo.addPermission(user.username, permission);
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.status(400);
            res.send("DB error \n\n"+err);
        });
});

module.exports = router;