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
    async getRiddleStatus(id){
        doc = await this.db.findOneAsync({ _id: id + "" })
        // doc is the document
        // If no document is found, doc is null
        if(doc==null || doc == undefined){
            // the riddle musn't be completed yet
            return {r1:false,r2:false,r3:false}
        } else return doc
        
        
    }

    setRiddleStatus(id,status){
        this.db.update({ _id: id+"" }, {_id: id+"",...status}, { upsert: true }, function (err, numReplaced, upsert) {
            // numReplaced = 1, upsert = status (the riddle status)
            // inserts or updates the data
            
        });
    }
}