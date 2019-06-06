const msgpack = require("msgpack-lite");
const Permission = require("./Permission");

class User {

    /**
     * Creates a user
     * @param isAdmin boolean flag that indicates if the user can manage the system
     * @param username of the user
     * @param name of the user (full name)
     * @param password for the user (hashed)
     * @param permissions list of the user
     * @param certificate  list of the user
     */
    constructor(isAdmin, username, name, password, permissions, certificate) {

        this.isAdmin = isAdmin;
        this.username = username;
        this.name = name;
        this.password = password;

        if(!permissions){
            permissions = [];
        }
        if(!certificate){
            certificate = [];
        }
        this.permissions = permissions;
        this.certificate = certificate;


    }

    //for debugging
    toString() {
        return JSON.stringify(this);
    }

    //since we do not have a certificate class yet this class handel the rendering of the certificate
    renderCert(c){
        var data = msgpack.decode(new Buffer(c, "hex"));


        var username = data.s;
        if (!/^([\w0-9._]+)$/.test(username)) {
            username = "";
        }

        var name = this.name;
        if(!/^[a-z ,.'-]+$/i.test(name)){
            name = ""
        }

        return "<div class=\"card\" >\n" +
            "<img src='img/certificateSign.png'>"+
            "<div class='CardTitle'><h1>"+username+"</h1><h2>"+name+"</h2></div>\n" +
            "<div class='CardDescription'>Validity: "+new Date(data.t*1000).toLocaleDateString()
            +" - "+new Date(data.e*1000).toLocaleDateString()+"</div>\n" +
            "</div>"
    }

    //We render de user information to display on the index site
    render() {
        let tokens = "";
        this.permissions.forEach(p => tokens = tokens + Permission.render(p));
        if(tokens === "") tokens = "<h3>No tokens found for this user</h3>";

        let cert = "";
        this.certificate.forEach(c => cert = cert + this.renderCert(c));
        if(cert === "") cert = "<h3>No certificates found for this user</h3>";

        return "<div class='user'><div class='userName'>"+ this.name +
            '</div><button class="collapsible"> Tokens: </button><div class="content">' + tokens +"</div> <button class='collapsible'> Certificates: </button><div class='content'>" + cert +"</div></div>";
    }
}

module.exports = User;