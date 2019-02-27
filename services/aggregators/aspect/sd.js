'use strict';

var mongoConfig = require('./config.json').mongodb
var MongoClient = require('mongodb').MongoClient

function aggregateAspects(current, snapshot){
	var retObj = {};
	retObj.aspects = [];
	
	Object.keys(snapshot.result.aspects).forEach(function(k){
		var found = false;
		if(null != current){
			Object.keys(current.result.aspects).forEach(function(i){
				console.log(current.result.aspects[i]);				
				if(current.result.aspects[i].aspect == snapshot.result.aspects[k].aspect 
				&& snapshot.result.aspects[k].polarity == 'positive' 
				&& snapshot.result.aspects[k].aspect_confidence > .5
				&& snapshot.result.aspects[k].polarity_confidence > current.result.aspects[i].polarity_confidence){
					found = true;
					delete snapshot.aspects[k].aspect;
					current.result.aspects[i].sentiment = snapshot.result.aspects[k];
					current.result.aspects[i].sentiment.url = snapshot.metadata.url;
				}
			});
		}
		if(false == found){
			var aspectObj = {};
			aspectObj.aspect = snapshot.result.aspects[k].aspect;
			delete snapshot.result.aspects[k].aspect;
			aspectObj.sentiment = snapshot.result.aspects[k];
			aspectObj.sentiment.url = snapshot.metadata.url;
			retObj.aspects.push(aspectObj);		
		}
	});	
	return retObj;	
}

exports.handler = (event, context, callback) => {
	var snapshot = event;
	context.callbackWaitsForEmptyEventLoop = false;
	MongoClient.connect(mongoConfig.url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(mongoConfig.db);
		var coll = dbo.collection('abs');
		coll.findOne({"metadata.organization": snapshot.metadata.organization, "metadata.product": snapshot.metadata.product}, {sort: { reviews: -1 }}, function(err, result) {
			if (err) throw err;
			snapshot = aggregateAspects(result, snapshot);									
		});
		db.close();	
		var retval = {};
		retval['abs'] = snapshot;

		//const fs = require('fs');
		//fs.writeFileSync("../../upstreamAspects.json", JSON.stringify(retval));
		
		return retval;
	});
}



