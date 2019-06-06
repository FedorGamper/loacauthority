const server = require("../main.js");
const request = require("supertest").agent(server.listen());
const assert = require('assert');
//const User = require("../model/User");
//const Resource = require("../model/Resource");
const Permission = require("../model/Permission");
const secret = require("../secret");
const async = require('async');

const subject = new loac.Subject();
const timeoutBetweenRequests = 2000;

//some basic test
//these test will not always succeed because the db is asynchronous
describe("Api Test", (done) => {

    before((done) => {
        let body = {
            "name": "Test User",
            "username": "testUser",
            "password": "password"
        };
        try{
            request
                .post("/addUser")
                .auth("admin", "password")
                .send(body)
                .expect(302, done);
        }catch (e) {
            console.log(e)
        }



    });
    beforeEach(done =>{
        setTimeout(()=>done(),timeoutBetweenRequests);//wait before next test
    });

    after((done) => {
        setTimeout(()=>{
            request
                .post("/deleteUser")
                .auth("admin", "password")
                .send({"username": "testUser"})
                .expect(302, done)
        },timeoutBetweenRequests);//wait



    });

    describe("authentication", () => {

        it("correct auth as admin", (done) => {
            request
                .get("/")
                .auth("admin", "password")
                .expect(200, done)
        });

        it("false password auth as admin", (done) => {
            request
                .get("/")
                .auth("admin", "passwort")
                .expect(401, done)
        });
        it("try get admin route as user", (done) => {
            request.get("/")
                .auth("testuser", "password")
                .expect(401, done);

        });

        it("access the api as admin", (done) => {
            request
                .get("/api/permissions")
                .auth("admin", "password")
                .expect(200, done)
        });


        it("access the api as user", (done) => {
            request
                .get("/api/permissions")
                .auth("testUser", "password")
                .expect(200, done)
        });

    });
    describe("/api/login",()=>{
       it("login as subject", (done)=>{
          let r = subject.generateOnboardingRequest("testUser");
          request
              .post("/api/login")
              .auth("testUser", "password")
              .send(r)
              .expect('Content-Type', /json/)
              .expect(200, done);
       });

    });
    describe("/api/getPermissions", ()=>{
       it("get all permissions of testuser",(done)=>{
           let token = new loac.PermissionAuthority(secret.pa.sk).issueToken("testUser", true, "testResource", new Date()-1000, new Date()+1000);
           let permission = new Permission("Test Resource", "testresource", "this is just for the test",
             "https://www.section508.gov/sites/all/themes/508retheme/images/icons/test-white.png", "test","test", token);
           mongo.addPermission("testUser", permission);
           setTimeout(()=>
               request
                   .get("/api/permissions")
                   .auth("testUser", "password")
                   .expect('Content-Type', /json/)
                   .expect((res)=>{
                       console.log(res.body);
                       assert.equal(res.body.length, 1);
                   })
                   .expect(200, done),
               timeoutBetweenRequests)

       });
       it("Permission correct result types",(done)=>{
           let token = new loac.PermissionAuthority(secret.pa.sk).issueToken("testUser", true, "testResource2", new Date()-1000, new Date()+1000);
           let permission = new Permission("Test Resource", "testresource2", "this is just for the test",
               "https://www.section508.gov/sites/all/themes/508retheme/images/icons/test-white.png", "test","test", token);
           mongo.addPermission("testUser", permission);
           request
               .get("/api/permissions")
               .auth("testUser", "password")
               .expect('Content-Type', /json/)
               .expect((res)=>{
                   var permission = res.body[0];

                   assert.equal(typeof permission.name, "string");
                   assert.equal(typeof permission.description, "string");
                   assert.equal(permission.delegatedBy, null);

                   assert.equal(Array.isArray(permission.buttons), true);
                   assert.equal(typeof permission.buttons[0].text, "string");
                   assert.equal(typeof permission.buttons[0].command, "string");

                   assert.equal(typeof permission.loac, "object" );
                   assert.equal(typeof permission.loac.resourceName, "string");
                   assert.equal(typeof permission.loac.tokens, "object");
                   assert.equal(Array.isArray(permission.loac.certificates), true);
               })
               .expect(200, done)
       });
    });
    describe("Post /addUser", ()=>{
        it("add testUser twice", (done)=>{

                request
                    .post("/addUser")
                    .auth("admin", "password")
                    .send(this.body)
                    .expect(400, done)


        })


    });
    describe("Post /deleteUser", ()=>{
        it("delete an user" , (done)=>{
            async.series([
                (done)=>{
                    request
                    .post("/addUser")
                    .auth("admin", "password")
                    .send({
                        "name": "Test Two",
                        "username": "testTwo",
                        "password": "password"
                    })
                    .expect(302, done)},
                (done)=>setTimeout(done, timeoutBetweenRequests),
                (done)=>{
                request
                    .post("/deleteUser")
                    .auth("admin", "password")
                    .send({"username": "testTwo"})
                    .expect(302, done)},

                (done)=>{request
                    .get("/api/permissions")
                    .auth("testTwo", "password")
                    .expect(401, done)}


        ], done);
        });
    it("delete user that does not exists",(done)=>{

        request
            .post("/deleteUser")
            .auth("admin", "password")
            .send({"username":"notInTheDB"})
            .expect(400, done)
    });
    })
});





