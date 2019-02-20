
var MongoClient = require('mongodb').MongoClient;

exports.handler = (event, context, callback) => {
	var snapshots = event.snapshots;
	var mongoConfig = event;
	var obj = {};	
	//To do - look for sentiment snapshot instead of assuming 2
	obj.organization = snapshots[2].organization;
	obj.product = snapshots[2].product;
	obj.endpoint = snapshots[2].endpoint;
	obj.sentiment = snapshots[2].result.polarity_confidence;		

	var database = mongoConfig.db;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(database);
		var coll = dbo.collection(obj.endpoint);
		coll.countDocuments().then((count) => {
			if(0 < count){
				coll.findOne({"organization":obj.organization, "product": obj.product}, {sort: { reviews: -1 }}, function(err, result) {
					if (err) throw err;
					//console.log("Last sentiment object", result);
					obj.sentiment = ((result.reviews * result.sentiment) + obj.sentiment)/(result.reviews+1);
					obj.reviews = result.reviews+1;
					//console.log("Current sentiment object", obj);
				});					
			}
			else {
				obj.reviews = 1;				
				console.log("Introducing Collection with ", obj);				
			}
			obj.timestamp = { type: Date, default: Date.now};
			db.close();	
			var snapshots = {};
			snapshots[0] = obj;
			callback(snapshots);
		});
	});
}


