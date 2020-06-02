var Datastore = require('react-native-local-mongodb')

export default class Database{
    constructor(){
        this.db = new Datastore({ filename: 'asyncStorageKey', autoload: true });

    }
    async fetchRiddles() {
        try {
            let response = await fetch('https://pastebin.com/raw/v4h2nQjE', {
                method: 'GET',
                /*headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                firstParam: 'yourValue',
                secondParam: 'yourOtherValue'
                })*/
            })
          let json = await response.json();
          return json;
        } catch (error) {
          console.error(error);
        }
      }
    
    
    // check how much of a riddle is completed, by getting it from the database
    getRiddleStatus(id){
        return new Promise((resolve,reject)=>{
            this.db.findOne({ _id: id + "" }, function (err, doc) {
                // doc is the document
                // If no document is found, doc is null
                if(doc==null){
                    // the riddle musn't be completed yet
                    resolve({r1:false,r2:false,r3:false})
                } else resolve(doc)
            });
        });
    }

    setRiddleStatus(id,status){
        this.db.update({ _id: id+"" }, status, { upsert: true }, function (err, numReplaced, upsert) {
            // numReplaced = 1, upsert = status (the riddle status)
            // inserts or updates the data
            
        });
    }
}