var config = require('./config.json').storers.mongodb;
var MongoClient = require('mongodb').MongoClient;

exports.handler = async(event, context) => {
	if(null == event.snapshots){
		return "No snapshots found";
	}
	var dbss = event.snapshots;
	//context.callbackWaitsForEmptyEventLoop = false;	
	let client = await MongoClient.connect(config.url, { useNewUrlParser: true });	
	let db = client.db(config.db);				
	try{
		Object.keys(dbss).forEach(function(key){
		db.collection(key).insertOne(dbss[key], function(err, res) {
			if (err) console.log("Failed Mongoisation");
			//console.log("Mongoised ", config.url);
			});
		});
		return "Mongoisation Complete";		
	}	
	finally{
		client.close();
	}
}

