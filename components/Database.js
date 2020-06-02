var Datastore = require('react-native-local-mongodb')

export default class Database{
    constructor(){
        this.db = new Datastore({ filename: 'asyncStorageKey', autoload: true });

    }

    fetchRiddles(){
        /*
        Fetches latest set of riddles from the REST api
        usage:
        Database.fetchRiddles().then((riddlearray)=>{
            riddes = riddlearray
        })
        */
        return new Promise((resolve,reject) =>{
            fetch('https://mywebsite.com/endpoint/', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                firstParam: 'yourValue',
                secondParam: 'yourOtherValue'
                })
            }).then((response)=>{
                resolve(response.json())
            }).catch(error=>{
                reject(error)
            })
        })
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
        db.update({ _id: id+"" }, status, { upsert: true }, function (err, numReplaced, upsert) {
            // numReplaced = 1, upsert = status (the riddle status)
            // inserts or updates the data
            
        });
    }
}