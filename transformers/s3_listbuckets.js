// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
//AWS.config.update({region: 'REGION'});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
	var uploadParams = {};
	uploadParams.Bucket = data.Buckets[0].Name;
	uploadParams.Body = "Something,anything";
	uploadParams.Key = "Something,anything";
	s3.putObject(uploadParams, function (err, data) {
	  if (err) {
		console.log("Error", err);
	  } if (data) {
		console.log("Upload Success", data);
	  }
	});
  }
});