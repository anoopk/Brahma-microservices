
const mongoConfig = require('./config.json').mongodb
var MongoClient = require('mongodb').MongoClient

exports.handler = (event, context, callback) => {
	if(null == event){
		console.log("No snapshots found.");
	}
	
	var snapshots = event;
	var obj = {"metadata":{}};	
	
	//To do - look for sentiment snapshot instead of assuming 2
	obj.metadata.organization = snapshots.metadata.organization;
	obj.metadata.product = snapshots.metadata.product;
	obj.endpoint = snapshots.endpoint;
	
	context.callbackWaitsForEmptyEventLoop = false;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(mongoConfig.db);
		var coll = dbo.collection('sentiment');
		
		coll.findOne({"metadata.organization":obj.organization, "metadata.product": obj.product}, {sort: { reviews: -1 }}, function(err, last) {
			if (err) throw err;
			if(null == last){										
				obj.reviews = 1;				
				obj.result = snapshots.result;						
				console.log("Introducing Collection with ", obj);				
			}
			else{
				obj.result = last.result;						
				if(snapshots.result.polarity == 'positive'
				&& snapshots.result.polarity_confidence > last.result.polarity_confidence){
				};
				obj.reviews = last.reviews+1;
			}
		});
		obj.timestamp = { type: Date, default: Date.now};
		db.close();	
		var snapshots = {};
		snapshots['sentiment'] = obj;
		//var fs = require('fs');
		//fs.writeFileSync("../../upstreamSentiment.json", JSON.stringify(snapshots));
		return snapshots;
	});
}



