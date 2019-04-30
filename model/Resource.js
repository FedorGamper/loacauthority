class Resource {
    constructor(name, loacName, descr, buttons, imageUrl){
        this.name = name;
        this.resourceName = loacName.toLowerCase();
        this.description = descr;
        this.buttons = buttons;
        this.imageUrl = imageUrl;

    }
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
                pa:[pa.pk],
                ia:[ia.pk]
            }
        };
        return json;

    }
}
module.exports = Resource;