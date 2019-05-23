# loacauthority
Prototype implementation for the authority application of the LOAC protocol.

The API and the web application is build with express.js.
All request need to be authenticated by Basic Authentication.

###Routes
The API has two routes, one for the user device and one for the authority application.

 
| Type | URL              | body                          | response                  |
|------|------------------|-------------------------------|---------------------------|
| GET  | /                |                               | list of users             |
| GET  | /manageUser      |                               | form to register new user |
| POST | /addUser         | username, name, password      | list of users             |
| POST | /deleteUser      | username                      | list of users             |
| GET  | /addPermission   |                               | form to add new           |
| POST | /addPermission   | username, resourcename        | list of users             |
|      |                  | access, validity, delegatable |                           |
| POST | /api/login       | onboarding request            | certificate               |
| GET  | /api/permissions |                               | list of permissions       |

###Code Structure

```
.
├── README.md
├── app.yaml                        config file for Google App Engine
├── controller                      controllers for the two API routes
│   ├── api_routes.js               controller for the API that communicates with the user application
│   └── authority_routes.js         controller for the API that communicates with the admin application
├── main.js                         main file with the express logic 
├── model                           
│   ├── Permission.js
│   ├── Resource.js
│   ├── User.js
│   └── mongodb.js
├── package.json
├── public                          files that are pubicly available
│   ├── img
│   │   ├── certificateSign.png
│   │   ├── favicon.ico
│   │   └── imgNotFound.png
│   ├── script
│   │   └── frontend.js
│   └── styles
│       └── style.css
├── secret.json                     files that contains the pw for the db and the private keys of the authority
├── test
│   └── apiTest.js
└── views                           Web Application html files.
    ├── addPermission.ejs
    ├── head.ejs
    ├── header.ejs
    ├── index.ejs
    └── manageUser.ejs
```
