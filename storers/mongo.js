var MongoClient = require('mongodb').MongoClient;

exports.handler = async(event, context) => {
	const dbss = {};
	const AWS = require('aws-sdk');
	var s3 = new AWS.S3();
	var params = {
		Bucket : "arn:aws:s3:::aggregators-dev-serverlessdeploymentbucket-pu393bpbga30",
		Key : "Snapshots",
	}
	s3.getObject(params, function(err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else 
		{
			dbss = data;
			console.log(dbss);
			MongoClient.connect(event.url, { useNewUrlParser: true }, function(err, db) {
				if (err) console.log(err);
				Object.keys(dbss).forEach(function(key){
				if (err) throw err;
				console.log("Uploading to collection", dbss[key].endpoint, event.db);
				var dbo = db.db(event.db);
				dbo.collection(dbss[key].endpoint).insertOne(dbss[key], function(err, res) {
					if (err) throw err;
					db.close();
					});
				});
			});			  
		}
	});		
}

