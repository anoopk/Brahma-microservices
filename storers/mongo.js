var MongoClient = require('mongodb').MongoClient;

exports.handler = async(event, context) => {
	if(null == event.snapshots){
		return "No snapshots found";
	}
	
	var dbss = event.snapshots;
	MongoClient.connect(event.url, { useNewUrlParser: true }, function(err, db) {
		if (err) console.log(err);
		Object.keys(dbss).forEach(function(key){
		if (err) throw err;
		console.log("Uploading to collection", dbss[key].endpoint, event.db);
		var dbo = db.db(event.db);
		dbo.collection(dbss[key].endpoint).insertOne(dbss[key], function(err, res) {
			if (err) throw err;
			db.close();
			});
		});
	});			
}

