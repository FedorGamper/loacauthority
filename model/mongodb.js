const User = require("./User");
const Resource = require("./Resource");
const mongoose = require('mongoose');
const sanitize = require("mongo-sanitize");
const secret = require("../secret.json");

/* Database:
        loac{
            resouces: Resource Records,
            users: User Records
 */
const dbname= "loac";
const url = "mongodb+srv://" + secret.db.username + ":" + secret.db.pw + "@loacprotocol-kf4bj.gcp.mongodb.net/"+dbname+"?retryWrites=true/";

mongoose.connect(url, {useNewUrlParser: true});

//ignore deprecation warnings form the MongoDB driver created by Mongoose
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

//connect to the DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//create the schemas for the users and the resouces
const Schema = mongoose.Schema;
const ResourceSchema = new Schema({
    name: String,
    resourceName: {type: String, unique: true},
    description: String,
    buttons: [
        {
            text: String,
            command: String
        }
    ],
    imageUrl: String
});
ResourceSchema.loadClass(Resource);
const ResourceModel = mongoose.model("resources", ResourceSchema);

const UserSchema = new Schema({
    isAdmin: Boolean,
    name: String,
    username: {type: String, unique: true},
    password: String,
    permissions: [{type: Schema.Types.Mixed, unique:true}],
    certificate: [{type: Schema.Types.Mixed, unique:true}]

});
UserSchema.loadClass(User);
const UserModel = mongoose.model("users", UserSchema);


class mongo {

    /**
     * Searches the db for the user with the specific username
     * @param {string} username
     * @returns {Promise<user>} user record as a promise
     */
    static async findUser(username) {
        username = sanitize(username);
        return UserModel.findOne({username: username}, (err, user) => {
            if (err) {
                throw err
            }
            return user;
        });
    }

    /**
     * Searches the db for all users
     * @returns {Promise<Array[user]>}
     */
    static async allUsers() {
        return UserModel.find({isAdmin: false}, (err, users) => {
            if (err) {
                throw err
            }
            return users;
        });
    }

    /**
     * Adds an user to the db
     * @param {User} user to be added to the db
     * @returns {Promise<user>} the user that was added
     */
    static async addUser(user) {
        user = sanitize(user);
        return UserModel.create(user,
            (err, user) => {
                if (err) {
                    throw err
                }
                return user
            }
        );
    }

    /**
     * Deletes an user out of the db
     * @param {string} username of the user that needs to be deleted out of the db
     * @returns {Promise<user>} that was deleted out of the db
     */
    static async deleteUser(username){
        username = sanitize(username);
        return UserModel.deleteOne({username:username},(err, instance)=>{
            if(err){
                throw err
            }
            if(instance.n === 0){
                throw "no user was deleted"
            }
            return instance;
        })
    }

    /**
     * Pushes a permission to the list of permissions of a given user
     * @param {string} username from the user that receive a new permission
     * @param {Permission} permission that needs to be added to the given user
     * @returns {Promise<err, instance>}
     */
    static async addPermission(username, permission) {
        username = sanitize(username);
        permission = sanitize(permission);
        return  UserModel.findOneAndUpdate(
            {username: username},
            {$push: {permissions: permission}},
            { upsert: true, new: true });
    }

    /**
     * Pushes a certificate to the list of certificates of a given user
     * @param {string} username from the user that receive a new certificate
     * @param {string} cert to be added to the given user
     * @returns {Promise<err, instance>}
     */
    static async addCert(username, cert) {
        username = sanitize(username);
        cert = sanitize(cert);
        return UserModel.findOneAndUpdate(
            {username: username},
            {$push: {certificate: cert}},
            { upsert: true, new: true});
    }

    /**
     * Adds a resource into the db
     * @param {Resource} resource that needs to be added to db
     * @returns {Promise<resource>} that was added to the db
     */
    static async addResource(resource){
        resource = sanitize(resource);
        return ResourceModel.create(resource,
            (err, resource) => {
                if (err) {
                    throw err
                }
                return resource
            }
        );
    }

    /**
     * Deletes a resource given by the resourceName out of the db
     * @param {string} resourceName of the resource that needs to be deleted
     * @returns {Promise<resource>} that was deleted out of the db
     */
    static async deleteResource(resourceName){
        resourceName = sanitize(resourceName);
        return ResourceModel.deleteOne({resouceName:resourceName},(err, instance)=>{
            if(err){
                throw err
            }
            return instance;
        })
    }

    /**
     * Returns all resources in the db
     * @returns {Promise<Array[resources]>}
     */
    static async allResources(){
        return ResourceModel.find({},(err, resources)=>{
            if(err){
                throw err
            }
            return resources;
        });
    }

    /**
     * Searches a resource in the db given his unique name
     * @param {string} resourceName of the resource that is searched
     * @returns {Promise<Query|void>}
     */
    static async findResource(resourceName){
        resourceName = sanitize(resourceName);
        return ResourceModel.findOne({resourceName:resourceName},(err, resource) => {
            if (err) {
                console.log("err: " + err)
            }
            return resource;
        });
    }

}
module.exports = mongo;
