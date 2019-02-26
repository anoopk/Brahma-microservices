var config = require('./config.json').storers.mongodb;
var MongoClient = require('mongodb').MongoClient;

exports.handler = async(event, context) => {
	if(null == event.snapshots){
		return "No snapshots found";
	}
	var dbss = event.snapshots;
	//context.callbackWaitsForEmptyEventLoop = false;	
	MongoClient.connect(config.url, { useNewUrlParser: true }, function(err, db) {
		if (err) console.log(err);
		Object.keys(dbss).forEach(function(key){
		if (err) throw err;
		var dbo = db.db(config.db);
		dbo.collection(key).insertOne(dbss[key], function(err, res) {
			if (err) throw err;
			db.close();
			console.log("Uploaded to collection", key, dbss[key]);			
			});
		});
		return;
	});			
}

