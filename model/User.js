class User {

    constructor(isAdmin, username, name, password, permissions, certificate) {

        this.isAdmin = isAdmin;
        this.username = username.toLowerCase();
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
    renderCert(){
        return "<div class=\"card\">\n" +
            "        <div class=\"CardTitle\"><h1>"+this.username+"</h1><h2>"+this.name+"</h2></div>\n" +
            "        <div class=\"CardDescription\">Access: Brew small coffee <br>Validity: 09-12-2019 - 10-12-2019</div>\n" +
            "    </div>"
    }

    render() {
        let usertype = this.isAdmin?"Administrator":"User";

        let tokens = "";
        this.permissions.forEach(p => tokens = tokens + p.render);
        if(tokens === "") tokens = "<h3>No tokens found for this user</h3>";

        let cert = "";
        this.certificate.forEach(c => cert = cert + `${this.renderCert()}`);
        if(cert === "") cert = "<h3>No certificates found for this user</h3>";

        return "<div class='user'><div class='userName'> "+usertype +" "+ `${this.username}` +
            '</div><button class="collapsible"> Tokens: </button><div class="content">' + tokens +"</div> <button class='collapsible'> certificate: </button><div class='content'>" + cert +"</div></div>";
    }
}

module.exports = User;