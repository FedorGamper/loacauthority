const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const Permission = require("../model/Permission");

//render the index page with the user data
router.get("/", (req, res) => {
    mongo.allUsers()
        .then(users => {
          res.render('index', {
                    users: users
                });
            }
        ).catch(err=>console.log(err));
});

//render the manage user page
router.get("/manageUser", (req, res) => {
    mongo.allUsers()
        .then((users)=>{
            res.render('manageUser', {
                users: users
            });
        }).catch(err=>console.log(err))

});

//add the user given by the request body into the database
router.post("/addUser", (req, res) => {

        //check if the username is correct if not the username is set to undefined and later an 400 message will be returned
        let username = req.body.username;
        if (!/^([\w0-9._]+)$/.test(username)) {
            console.log("username not valid:" + username);
            username = undefined;
        }

        //check if the name is correct if not the name is set to undefined and later an 400 message will be returned
        let name = req.body.name;
        if (!/^([\w\s0-9._]+)$/.test(name)) {
            console.log("name not valid:" + name);
            name = undefined;
        }

        let password = req.body.password;

        //if the name, username or password is not correct or not defined, an error message will be returned
        if (username !== undefined && name !== undefined && password !== undefined) {
            //hash the password with 10 salt rounds
            let salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);

            //create an new user with an empty certificate and permission list and add it into the database
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

//delete an user given by his username in the request body
//if the user is not found in the database an 400 error will be returned
router.post("/deleteUser", (req, res)=>{
    if(req.body.username !== undefined){
        //delete the user out of the database
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

//render the add permission site
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

//add a permission to an user both given in the request body
router.post("/addPermission", (req, res) => {

    let fromDate = loac.utils.dateToUnixTime(new Date(req.body.from));
    let untilDate = loac.utils.dateToUnixTime(new Date(req.body.until));
    let delegable = req.body.delegable == 1;

    //search the resource and user in the database and then add the token to the user and update the database
    Promise.all([mongo.findUser(req.body.username), mongo.findResource(req.body.resource)])
        .then(([user, resource]) => {
            let token = pa.issueToken(user.username, delegable, resource.resourceName, fromDate, untilDate);
            let permission = new Permission(resource.name, resource.resourceName, resource.description, resource.imageUrl, resource.buttons , token);
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