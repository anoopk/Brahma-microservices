
const mongoConfig = require('./config.json').mongodb
var MongoClient = require('mongodb').MongoClient

exports.handler = (event, context, callback) => {
	if(null == event.snapshots){
		console.log("No snapshots found.");
	}
	
	var snapshots = event.snapshots;
	var obj = {"metadata":{}};	
	var retVal = {};	
	
	obj.metadata.organization = snapshots.metadata.organization;
	obj.metadata.product = snapshots.metadata.product;
	obj.endpoint = snapshots.endpoint;
	
	context.callbackWaitsForEmptyEventLoop = false;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(mongoConfig.db);
		var coll = dbo.collection("sentiment");
		
		coll.findOne({"metadata.organization":obj.organization, "metadata.product": obj.product}, {sort: { reviews: -1 }}, function(err, last) {
			if (err) throw err;
			if(null == last){										
				obj.reviews = 1;				
				obj.result = snapshots.result;						
				//console.log("Introducing Collection with ", obj);				
			}
			else{
				obj.result = last.result;						
				if(snapshots.result.polarity == 'positive'
				&& snapshots.result.polarity_confidence > last.result.polarity_confidence){
					console.log();
				};
				obj.reviews = last.reviews+1;
			}
		});
		db.close();		
		obj.timestamp = { type: Date, default: Date.now };
		retVal['sentiment'] = obj;
	});
	return retVal;												
}



