'use strict';
var aylien = require("aylien");

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
	var ai = new aylien(event.strangedesigns.serviceproviders.credentials, infoObj);		
	var aiPABS = ai.AnalyseABS();			
	var aiP = ai.Analyse();
	var snapshots = {};
	await Promise.all([aiPABS, aiP]).then(function(results){
		console.log("Aylienized wiki entry for ", infoObj);
		snapshots = createDBSnapshots(results, infoObj, event.watch);
	});
	return snapshots;
}

