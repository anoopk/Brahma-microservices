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
// Create S3 service object
	const AWS = require('aws-sdk');
	var s3 = new AWS.S3({apiVersion: '2006-03-01'});
	// Call S3 to list the buckets
	var uploadParams = {};
	uploadParams.Bucket = "transformer-dev-serverlessdeploymentbucket-12t9niv5yoqyl";
	uploadParams.Body = "Something,anything";
	uploadParams.Key = "Something,anything";
	s3.putObject(uploadParams, function (err, data) {
	  if (err) {
		console.log("Error", err);
	  } if (data) {
		console.log("Upload Success", data);
	  }
	});
	var infoObj = event.transform;
	var ai = new aylien(event.strangedesigns.serviceproviders.credentials, infoObj);		
	var aiPABS = ai.AnalyseABS();			
	var aiP = ai.Analyse();
	var snapshots = {};
	await Promise.all([aiPABS, aiP]).then(function(results){
		console.log("Aylienized wiki entry for ", infoObj);
		snapshots = createDBSnapshots(results, infoObj, event.strangedesigns.watch);
	});
	var params = {
		Bucket : "transformer-dev-serverlessdeploymentbucket-12t9niv5yoqyl",
		Key : "Snapshots",
		Body : JSON.stringify(snapshots)
	}		
	console.log("Putting", JSON.stringify(snapshots));
	s3.putObject(params, function(err, data) , function (err, data) {
	  if (err) {
		console.log("Error", err);
	  } if (data) {
		console.log("Upload Success", data);
	  }
	});
	return "tada";
}

