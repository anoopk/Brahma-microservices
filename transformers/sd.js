'use strict';
const config = require("./config.json").transformers;
const aylien = require("./aylien");

function createDBSnapshots(results, urlobj, watch){
	var snapshots = {};
	var index = 0;
	snapshots[index++] = {"endpoint" : "abs", "result": results[0], "organization": urlobj.organization, "product": urlobj.product};
	Object.keys(results[1].results).forEach(function(key){
		snapshots[index] = results[1].results[key];
		snapshots[index].organization = urlobj.organization;
		snapshots[index].product = urlobj.product;
		snapshots[index++].url = urlobj.url;
	});
	return snapshots;	
}

exports.handler = async(event, context) => { 
	var infoObj = event.transform;
	
	var ai = new aylien(config.strangedesigns.serviceproviders.credentials, infoObj);		
	var aiPABS = ai.AnalyseABS();			
	var aiP = ai.Analyse();
	var snapshots = {};
	var params = {
		Bucket : "transformer-dev-serverlessdeploymentbucket-12t9niv5yoqyl",
		Key : "Snapshots"
	}			
	await Promise.all([aiPABS, aiP]).then(function(results){
		//Send extra data to s3 bucket
		delete results[0].text;
		delete results[0].aspects;
		delete results[0].sentences;		
		delete results[1].text;
		console.log("Aylienized wiki entry for ", infoObj);
		snapshots = createDBSnapshots(results, infoObj, config.strangedesigns.watch);
	});	
	return snapshots;
}

