class Permission {
    /**
     * Create an new permission
     * @param name of the resource (full name)
     * @param loacName of the resource
     * @param desc of the resource
     * @param imageURL of the resource (base64 encoded)
     * @param buttons for the accesses the resource allowes the user to make
     * @param token signed by the authority
     */
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

    static render(p){
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

}
module.exports = Permission;