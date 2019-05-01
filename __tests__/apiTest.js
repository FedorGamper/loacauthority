

describe("DB test", ()=>{

    const User = require('../model/User');
    const Permission = require('../model/Permission');
    const DB = require("../model/mongodb");
    let testuser = new User(false,"testuser","Test User", "$2b$10$uQu5POudgz/PilxYAldzLuUlUmhBOxYw8nxhIy/eGWNfmJnFo6O6y"); //pw = password
    DB.addUser(testuser);


  test("AddUser Test",()=>{
      const DB = require("../model/DB");
      let testAdmin = new User(true, "testAdmin", "Test Admin",  "$2b$10$uQu5POudgz/PilxYAldzLuUlUmhBOxYw8nxhIy/eGWNfmJnFo6O6y")
      DB.addUser(testAdmin);

      let users = DB.getUsers();

      //fillter out the users
      users = users.filter(r=>r.username === testAdmin.username || testuser.username);
      expect(users.length).toBe(2);

      //check if the users are of the class User and have an empty cert and perm array
      for( var i in users){
          expect(users[i]).toBeInstanceOf(User);
          expect(users[i]).toHaveProperty("certificate", []);
          expect(users[i]).toHaveProperty("permissions", []);
      }


    });
  test("findUserByName Test",()=>{
      let toTestUser =  DB.findUserByName("testuser");
      expect(toTestUser).toMatchObject(testuser);

  });

  test("addPermission Test",()=>{

      let testPermission = new Permission("Test Resource",
          "testRes", "for test",
          "data:image/jpeg;base64,/9j/4lGx0tLS0tLSAooooAKKKKA",
          "test access text",
          "test access button",
          {
              "delegable": true,
              "resource": "testresource",
              "validityStart": 1555891200,
              "validityEnd": 1556064000,
              "signature": "e5808adb1340e765ebf56629ec24eb9f81a8928aeed21504f8214855221a546da248c63b430cfe2d7f343a95b2391ede01"
          });

      DB.addPermission("testuser", testPermission );

      let toTestPermission = DB.getPermissions("testuser")[0];
      expect(toTestPermission).toMatchObject(testPermission);

      toTestPermission = DB.findUserByName("testuser").permissions[0];
      expect(toTestPermission).toMatchObject(testPermission);

  });



  test("AddCert and validity Test", ()=> {

        const secret = require("../secret.json");
        const loac = require("loacprotocol").init("p192");
        const subject = new loac.Subject();
        const resource = new loac.Resource("resource",secret.ia.pk, secret.pa.pk,20);
        const pa = new loac.PermissionAuthority(secret.pa.sk);
        global.ia = new loac.IdentityAuthority(1000, secret.ia.sk);

        let now = loac.utils.dateToUnixTime(new Date());
        let token = pa.issueToken('testuser', true, "resource", now-1000, now+1000);

        let onboardingReq = subject.generateOnboardingRequest('testuser');

        const api = require("../controller/api_routes");

        //mock response to run test
        let res = {
            s:0,
            status:function (i) {
                this.s = i
            },
            res:{},
            json:function (r) {
                this.res = r
            }

        };

        api.login(onboardingReq,"testuser", res);

        let toTestUsr = DB.findUserByName("testuser");

        //check if cert was added
        expect(toTestUsr.certificate.length).toBe(1);

        //check if cert is valid
        let accReq = subject.createAccessRequest('resource', 'open', [token], [toTestUsr.certificate[0]]).serialize();
        resource.checkAccessRequest(accReq, (username, action)=>{
            expect(username).toBe(toTestUsr.username);
            expect(action).toBe("open");
        })
    });

    test("Db Permission Objects format test", ()=>{

        let testPermission = new Permission("Test Resource",
            "testRes", "for test",
            "data:image/jpeg;base64,/9j/4lGx0tLS0tLSAooooAKKKKA",
            "test access text",
            "test access button",
            {
                "delegable": true,
                "resource": "testresource",
                "validityStart": 1555891200,
                "validityEnd": 1556064000,
                "signature": "e5808adb1340e765ebf56629ec24eb9f81a8928aeed21504f8214855221a546da248c63b430cfe2d7f343a95b2391ede01"
            });

        DB.addPermission(testuser.username,testPermission);
        let toTestPerm = DB.getPermissions("testuser")[0];

        expect(typeof(toTestPerm.name)).toBe("string");
        expect(typeof(toTestPerm.description)).toBe("string");
        expect(typeof(toTestPerm.imageUrl)).toBe("string");
        expect(toTestPerm.delegatedBy).toBe(null);
        expect(typeof(toTestPerm.buttons)).toBe("object");
        expect(typeof(toTestPerm.loac)).toBe("object");

        for(var i in toTestPerm.buttons){
            expect(typeof(toTestPerm.buttons[i].text)).toBe("string");
            expect(typeof(toTestPerm.buttons[i].command)).toBe("string");
        }

        expect(typeof(toTestPerm.loac.resourceName)).toBe("string");
        expect(typeof(toTestPerm.loac.tokens)).toBe("object");
        expect(typeof(toTestPerm.loac.certificates)).toBe("object");

        for(var i in toTestPerm.loac.tokens){
            expect(toTestPerm.loac.tokens[i].delegable).toBeTruthy();
            expect(typeof(toTestPerm.loac.tokens[i].resource)).toBe("string");
            expect(typeof(toTestPerm.loac.tokens[i].validityStart)).toBe("number");
            expect(typeof(toTestPerm.loac.tokens[i].validityEnd)).toBe("number");
        }



    });

});