var config = require('./config.json').storers.mongodb;
var MongoClient = require('mongodb').MongoClient;

exports.handler = async(event, context) => {
	if(null == event.snapshots){
		return "No snapshots found";
	}
	var dbss = event.snapshots;
	//context.callbackWaitsForEmptyEventLoop = false;	
	try{
		await MongoClient.connect(config.url, { useNewUrlParser: true }, (function(err, client){
			const dbo = client.db(config.db);			
			Object.keys(dbss).forEach(function(key){
			if (err) throw err;
			dbo.collection(key).insertOne(dbss[key], function(err, res) {
				if (err) throw err;
				db.close();
				});
			});
		}));
	}
	catch (err){
		console.log(err);
	}
}

