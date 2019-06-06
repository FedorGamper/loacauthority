const secret = require("../secret");
class Resource {
    /**
     * Create a resource, this class is courently not really used but could be used in the future
     * @param name of the resource (full name)
     * @param loacName of the resource
     * @param desc of the resource
     * @param buttons that describes the access a user can preform on the resource
     * @param imageUrl of the resource (base64 encoded)
     */
    constructor(name, loacName, desc, buttons, imageUrl){
        this.name = name;
        this.resourceName = loacName.toLowerCase();
        this.description = desc;
        this.buttons = buttons;
        this.imageUrl = imageUrl;

    }

    //generate the json config file for setting up a resource (currently not used)
    get createConfigFile(){
        let json = {
            uuid: {
                service: "4c6f6163-5072-6f74-6f63-6f6c53657230",
                accReq:   "4c6f6163-5072-6f74-6f63-6f6c43686130",
                time:     "4c6f6163-5072-6f74-6f63-6f6c43686131",
                state:    "4c6f6163-5072-6f74-6f63-6f6c43686132"
            },
            name: this.resourceName,
            suite: "p192",
            derivationThreshold:10,
            trustStore:{
                pa:[secret.pa.pk],
                ia:[secret.ia.pk]
            }
        };
        return json;

    }
}
module.exports = Resource;