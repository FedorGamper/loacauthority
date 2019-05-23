const msgpack = require("msgpack-lite");

class User {

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

    toString() {
        return JSON.stringify(this);
    }

    renderPerm(p){

        // check the variables received from the db
        var img = p.imageUrl;
        if (!/^data:image\/((jpeg)|(png));base64,[0-9a-zA-Z+\/=]*$/.test(img)) {
            img = "img/imgNotFound.png";
            console.log("wrong IMG given from db")
        }

        var name = p.name;
        if(!/^[a-z ,.'-]+$/i.test(name)){
            name = "Object";
            console.log("wrong IMG given")
        }
        var desc = p.description;
        if(!/^[a-z ,.'-]+$/i.test(desc)){
            desc = "no description";
            console.log("wrong IMG given from db")
        }

        var isdelagatable = p.loac.tokens[0].delegable?"delegatable":"";

        return "<div class=\"card\">\n" +
            "        <div class=\"img\" style=\"background-image: url("+img+");\"></div>\n" +
            "        <div class=\"CardTitle\"><h1>"+name+"</h1><h2>"+desc+"   "+isdelagatable+"</h2></div>\n" +
            "\n" +
            "        <div class=\"CardDescription\">Validity: "+
            new Date(p.loac.tokens[0].validityStart * 1000).toLocaleDateString()
            +" - "+
            new Date(p.loac.tokens[0].validityEnd * 1000).toLocaleDateString()
            +"</div>\n" +
            "    </div>"
    }

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

    render() {

        let tokens = "";
        this.permissions.forEach(p => tokens = tokens + this.renderPerm(p));
        if(tokens === "") tokens = "<h3>No tokens found for this user</h3>";

        let cert = "";
        this.certificate.forEach(c => cert = cert + this.renderCert(c));
        if(cert === "") cert = "<h3>No certificates found for this user</h3>";

        return "<div class='user'><div class='userName'>"+ this.name +
            '</div><button class="collapsible"> Tokens: </button><div class="content">' + tokens +"</div> <button class='collapsible'> Certificates: </button><div class='content'>" + cert +"</div></div>";
    }
}

module.exports = User;