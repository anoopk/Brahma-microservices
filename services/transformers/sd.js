'use strict';
const config = require("./config.json").transformers;
const aylien = require("./aylien");

function createDBSnapshots(results, urlobj, watch){
	var snapshots = {};
	var snapshot = {};
	var index = 1;
	snapshot.metadata = {"organization": urlobj.organization, "product": urlobj.product, "url": urlobj.url};
	snapshot.result = results[0];
	snapshots['abs'] = snapshot;
	
	Object.keys(results[1].results).forEach(function(key){
		var snapshot = {};
		snapshot.metadata = {"url": urlobj.url, "organization": urlobj.organization, "product": urlobj.product};
		snapshot.result = results[1].results[key];
		snapshots[results[1].results[key].endpoint] = snapshot;				
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
	await Promise.all([aiPABS, aiP]).then(async function(results){
		//Send extra data to s3 bucket
		delete results[0].text;
		//delete results[0].aspects;
		delete results[0].sentences;		
		delete results[1].text;
		console.log("Aylienized wiki entry for ", infoObj);
		snapshots = createDBSnapshots(results, infoObj, config.strangedesigns.watch);
		const fs = require('fs');
		await fs.writeFile("./snapshots.json", JSON.stringify(snapshots), (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});
	});	
	return snapshots;
}

