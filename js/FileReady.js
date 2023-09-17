let FileReady = {
    Objects: {},
    /** 
     * @param {string} string name of your object
     * @param {function} callback function
    */
    onload(fileName, callback) {
        if (typeof this[fileName] != 'object') { // create obj
            this.Objects[fileName] = {
                calls: [],
                onload(remove = true) {
                    for (let i = 0; i < this.calls.length; i++) {
                        this.calls[i]();
                    }
                    if (remove) { this.calls = []; }
                }
            }
            this.Objects[fileName].calls.push(callback);
        } else {
            this.Objects[fileName].calls.push(callback);
        }
    },
    on(fileName, remove = true) { 
        if (fileName != undefined) {
            if (this.Objects[fileName] != undefined) {
                this.Objects[fileName].onload(remove);
            } else {
                const err = new Error("The "+ fileName + " is undefined");
                console.log("%c"+err, "background: red; color: white; font-weight: bold;");
            }
            return;
        }
        let keys = Object.keys(this.Objects);
        for (let i = 0; i < keys.length; i++) {
            this.Objects[keys[i]].onload();
        }
    }
}
