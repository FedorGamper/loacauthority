class Permission {
    constructor(name, loacName, desc, imageURL, buttons, token) {

        this.name = name;
        this.description = desc;
        this.imageUrl = imageURL;
        this.delegatedBy = null;
        this.buttons = buttons;
        this.loac = {
            "resourceName": loacName,
            "tokens": [token],
            "certificates": []
        };
    }

    render(){
        return "<div class=\"card\">\n" +
            "        <div class=\"img\" style=\"background-image: url("+this.imageUrl+");\"></div>\n" +
            "        <div class=\"CardTitle\"><h1>"+this.name+"</h1><h2>"+this.description+"</h2></div>\n" +
            "\n" +
            "        <div class=\"CardDescription\">Access: "+this.buttons[0].text+" <br>Validity: "+
            new Date(this.loac.tokens[0].validityStart * 1000).toLocaleDateString()
            +" - "+
            new Date(this.loac.tokens[0].validityEnd * 1000).toLocaleDateString()
           +"</div>\n" +
            "    </div>"
    }

}
module.exports = Permission;