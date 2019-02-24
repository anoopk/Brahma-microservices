'use strict';

var mongoConfig = require('./config.json').aggregators.strangedesigns
var MongoClient = require('mongodb').MongoClient

function aggregateAspects(current, snapshot){
	//Move anything in the newlist not in the current
	/*var aspectscurrent = [];
	current.forEach(function(value){
		aspectscurrent.push(value.aspect);
	});
	
	var aspectsnew = [];
	snapshot.forEach(function(value){
		console.log(value);
		aspectsnew.push(value.aspect);
	});

	var j=0;
	for (var i=0; i < aspectsnew.length; ++i)
		if (aspectscurrent.indexOf(aspectsnew[i]) != -1){
			result.aspect = aspectsnew[i];
			result.aspect.url = "";
			result.aspect.url
		}
		else 		
			current.add(snapshot.aspectsnew[i]);
		
	console.log(">>>>>>> ", c);
	//Aggregate the aspects that exist in both into the current*/
	return current;
}

exports.handler = (event, context, callback) => {
	if(null == event){
		console.log("No snapshots found.");
	}
	
	var snapshot = event;
	var obj = {};	
	//To do - look for sentiment snapshot instead of assuming 2
	obj.organization = snapshot.organization;
	obj.product = snapshot.product;
	obj.endpoint = snapshot.endpoint;
	obj.sentiment = snapshot.result.polarity_confidence;

	//console.log("Aspects ", snapshot.result.aspects);	

	context.callbackWaitsForEmptyEventLoop = false;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(mongoConfig.db);
		var coll = dbo.collection(obj.endpoint);
		const fs = require('fs');
		coll.findOne({"organization":obj.organization, "product": obj.product}, {sort: { reviews: -1 }}, function(err, result) {
			var result = JSON.parse(fs.readFileSync("event.json", 'utf8'));
			if (err) throw err;
			if(null == result){										
				obj.reviews = 1;
				obj.aspects = snapshot.result.aspects;
				//console.log("Introducing Collection with ", obj);				
			}
			else{
				delete snapshot.result.aspects[0];
				delete snapshot.result.aspects[1];
				delete snapshot.result.aspects[2];
				delete snapshot.result.aspects[3];
				
				obj = aggregateAspects(result[0].result.aspects, snapshot.result.aspects);									
				//obj.aspects = snapshot.result.aspects;
				//obj.reviews = result.reviews+1;
				//console.log("Current sentiment object", obj);				
			}
		});
		obj.timestamp = { type: Date, default: Date.now};
		db.close();	
		
		var snapshots = {};
		snapshots[0] = obj;
		return snapshots;
	});
}



