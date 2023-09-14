var fs = require('fs')

const millisecondsInDay = require('../constants/millisecondsInDay')

 class Connection {
    constructor(data) {
        this.createdAt = Date.now()
        this.toBeRemovedAt = this.createdAt + ( (parseInt(data?.toBeRemovedDays,10) || 7)  * millisecondsInDay )
        this.url = data.url
        this.phoneNumber = data.phoneNumber
    }

}

const connectionsFilePath = __dirname + '/connections.json'
  async function getConnectionsList () {
    try{
     const data =    await fs.promises.readFile(connectionsFilePath, "utf8")
      return JSON.parse(data)
    }catch (err) {
        console.log('err')
        return []
    }
}

 async function   pushToConnectionsList (payload = {}) {

    const data = await getConnectionsList()

   const uniqData =  new Map (  data.map( (item)=> {
         return [ item.url, item ]
   })  )

    const connection = new Connection(payload)

    uniqData.set( connection.url, connection  )

    return  fs.writeFile (connectionsFilePath, JSON.stringify(Array.from(uniqData.values())), function(err) {
            if (err) {
                console.log( err )
                return []
            }
            return data
        }
    );

}

async function  deleteConnectionByUrl ([...args]) {

    if (!args.length) {
        return
    }

   const data = await getConnectionsList()

   const  filterData = data.filter((item)=> {
       return !args.includes(item.url)
   })

   return  fs.writeFile (connectionsFilePath, JSON.stringify( filterData ), function(err) {
            if (err) {
                return []
            }
            return data
        }
    );
}

module.exports.pushToConnectionsList = pushToConnectionsList;
module.exports.deleteConnectionByUrl = deleteConnectionByUrl;
module.exports.getConnectionsList = getConnectionsList;