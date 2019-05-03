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
        return "<div class=\"card\">\n" +
            "        <div class=\"img\" style=\"background-image: url("+p.imageUrl+");\"></div>\n" +
            "        <div class=\"CardTitle\"><h1>"+p.name+"</h1><h2>"+p.description+"</h2></div>\n" +
            "\n" +
            "        <div class=\"CardDescription\">Access: "+p.buttons[0].text+" <br>Validity: "+
            new Date(p.loac.tokens[0].validityStart * 1000).toLocaleDateString()
            +" - "+
            new Date(p.loac.tokens[0].validityEnd * 1000).toLocaleDateString()
            +"</div>\n" +
            "    </div>"
    }

    renderCert(c){
        var data = msgpack.decode(new Buffer(c, "hex"));
        return "<div class=\"card\" >\n" +
            "<img src=\"https://png2.kisspng.com/sh/05f91aa3531f5c13ed218db82ecc4f17/L0KzQYm3VMIyN5tsfZH0aYP2gLBuTgJwe5Z5jNc2Y3BwgMb7hgIucZR0huU2Y3zsgH7okwQuepDxhNdtLXTsgL32jfEua5Z3jNtvaXPkhLa0kvljapDzReR4bHz2PYbohPFmaZc5etg9M0KzPoe7VMM0OmgASac7NEK8RoW6Vsc5O2UziNDw/kisspng-rosette-computer-icons-clip-art-rolled-diploma-certificate-ribbon-rolls-5adaeaf4bf4320.6443327915242964367834.png\">"+
            "<div class=\"CardTitle\"><h1>"+data.s+"</h1><h2>"+this.name+"</h2></div>\n" +
            "<div class=\"CardDescription\">Validity: "+new Date(data.t*1000).toLocaleDateString()
            +" - "+new Date(data.e*1000).toLocaleDateString()+"</div>\n" +
            "</div>"
    }

    render() {
        let usertype = this.isAdmin?"Administrator":"User";

        let tokens = "";
        this.permissions.forEach(p => tokens = tokens + this.renderPerm(p));
        if(tokens === "") tokens = "<h3>No tokens found for this user</h3>";

        let cert = "";
        this.certificate.forEach(c => cert = cert + this.renderCert(c));
        if(cert === "") cert = "<h3>No certificates found for this user</h3>";

        return "<div class='user'><div class='userName'> "+usertype +" "+ this.name +
            '</div><button class="collapsible"> Tokens: </button><div class="content">' + tokens +"</div> <button class='collapsible'> Certificates: </button><div class='content'>" + cert +"</div></div>";
    }
}

module.exports = User;