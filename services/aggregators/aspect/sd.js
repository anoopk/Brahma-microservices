'use strict';

var mongoConfig = require('./config.json').aggregators.strangedesigns
var MongoClient = require('mongodb').MongoClient

function aggregateAspects(current, snapshot, url){
	console.log(url);
	var retObj = {};
	retObj.aspects = [];
	Object.keys(snapshot.aspects).forEach(function(k){
		var found = false;
		Object.keys(current.aspects).forEach(function(i){
			if(current.aspects[i].aspect == snapshot.aspects[k].aspect 
			&& snapshot.aspects[k].polarity == 'positive' 
			&& snapshot.aspects[k].aspect_confidence > .5
			&& snapshot.aspects[k].polarity_confidence > current.aspects[i].sentiment.polarity_confidence){
				found = true;
				delete snapshot.aspects[k].aspect;
				current.aspects[i].sentiment = snapshot.aspects[k];
				current.aspects[i].sentiment.url = url;
			}
		});
		if(false == found){
			var aspectObj = {};
			aspectObj.aspect = snapshot.aspects[k].aspect;
			delete snapshot.aspects[k].aspect;
			aspectObj.sentiment = snapshot.aspects[k];
			aspectObj.sentiment.url = url;
			retObj.aspects.push(aspectObj);		
		}
	});
	console.log(JSON.stringify(retObj));
	return retObj;	
}

exports.handler = (event, context, callback) => {
	if(null == event){
		console.log("No snapshots found.");
	}
	
	var snapshot = event;
	console.log(snapshot);
	
	var obj = {};	

	context.callbackWaitsForEmptyEventLoop = false;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(mongoConfig.db);
		var coll = dbo.collection(snapshot.endpoint);
		const fs = require('fs');
		coll.findOne({"organization": obj.organization, "product": obj.product}, {sort: { reviews: -1 }}, function(err, result) {
			var result = JSON.parse(fs.readFileSync("current.json", 'utf8'));
			if (err) throw err;
			obj = aggregateAspects(result, snapshot.result, snapshot.url);									
		});
		db.close();	
		//To do - look for sentiment snapshot instead of assuming 2
		obj.timestamp = { type: Date, default: Date.now};
		obj.organization = snapshot.organization;
		obj.product = snapshot.product;
		obj.endpoint = snapshot.endpoint;
		
		var snapshots = {};
		snapshots[0] = obj;
		return snapshots;
	});
}



