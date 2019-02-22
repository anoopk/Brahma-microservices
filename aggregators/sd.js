const mongoConfig = require('./config.json').aggregators.strangedesigns
var MongoClient = require('mongodb').MongoClient

exports.handler = (event, context, callback) => {
	if(null == event){
		console.log("No snapshots found.");
	}
	
	var snapshots = event.snapshots;
	var obj = {};	
	//To do - look for sentiment snapshot instead of assuming 2
	obj.organization = snapshots[2].organization;
	obj.product = snapshots[2].product;
	obj.endpoint = snapshots[2].endpoint;
	obj.sentiment = snapshots[2].result.polarity_confidence;		

	context.callbackWaitsForEmptyEventLoop = false;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(mongoConfig.db);
		var coll = dbo.collection(obj.endpoint);
		
		coll.countDocuments().then((count) => {
			if(0 < count){
				coll.findOne({"organization":obj.organization, "product": obj.product}, {sort: { reviews: -1 }}, function(err, result) {
					if (err) throw err;
					if(null == result){										
						obj.reviews = 1;				
						console.log("Introducing Collection with ", obj);				
					}
					else{
						obj.sentiment = ((result.reviews * result.sentiment) + obj.sentiment)/(result.reviews+1);
						obj.reviews = result.reviews+1;
						//console.log("Current sentiment object", obj);
					}
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
			return snapshots;
		});
	});
}


