
const mongoConfig = require('./config.json').mongodb
var MongoClient = require('mongodb').MongoClient

exports.handler = (event, context, callback) => {
	if(null == event){
		console.log("No snapshots found.");
	}
	
	var snapshots = event;
	var obj = {"metadata":{}};	
	
	//To do - look for sentiment snapshot instead of assuming 2
	obj.metadata.organization = snapshots.organization;
	obj.metadata.product = snapshots.product;
	obj.endpoint = snapshots.endpoint;
	
	context.callbackWaitsForEmptyEventLoop = false;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(mongoConfig.db);
		var coll = dbo.collection(obj.endpoint);
		
		coll.findOne({"metadata.organization":obj.organization, "metadata.product": obj.product}, {sort: { reviews: -1 }}, function(err, last) {
			if (err) throw err;
			if(null == last){										
				obj.reviews = 1;				
				obj.result = result.result;						
				console.log("Introducing Collection with ", obj);				
			}
			else{
				obj.result = result.result;						
				if(snapshots.result.polarity == 'positive'
				&& snapshots.result.polarity_confidence > result.result.polarity_confidence){
					obj.
				};
				obj.reviews = result.reviews+1;
			}
		});
		obj.timestamp = { type: Date, default: Date.now};
		db.close();	
		var snapshots = {};
		snapshots['sentiment'] = obj;
		var fs = require('fs');
		fs.writeFileSync("../../upstreamSentiment.json", JSON.stringify(snapshots));
		return snapshots;
	});
}



