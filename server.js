const ex = require('./executor.js')

exports.handler = async(event, context) => {
	const config  = event;
	//Read the metadata 
	//var aylien = require('./lib/Transformers/sd');
	const mongo = require('./lib/Stores/mongo');
	//Send URL text to Aylien API analyse for Classification of subject, Sentiment, Aspect Based Sentiments and Entity Detection.
	//Transform the return JSON 
	await ex.handler(config.transformers, {}).then(async function(snapshots, error) {
		config.storers.mongodb.snapshots = snapshots;
		config.storers.mongodb.db = config.storers.mongodb.databases.analysis;
		ex.handler(config.storers.mongodb);
				
		//Log the Aylien snaps hots locally
		const logger = require('./lib/Stores/logger');		
		var append = true;
		config.storers.logger.snapshots = snapshots;
		logger.handler(config.storers.logger, {}).then((result) => { console.log("Local copies of data made.");});
		
		var us = require('./lib/Aggregators/sd');
		config.aggregators.strangedesigns.snapshots = snapshots;
		config.aggregators.strangedesigns.db = config.storers.mongodb.databases.analysis;
		await us.handler(config.aggregators.strangedesigns, {}, (result) => { 
			console.log("Upstream data aggregated.");
			var mongo = require('./lib/Stores/mongo');
			config.aggregators.strangedesigns.snapshots = result;
			config.aggregators.strangedesigns.db = config.storers.mongodb.databases.aggregate;
			mongo.handler(config.aggregators.strangedesigns, {}, () => {console.log("Data moved to Mongo")});
		});				
	});
	return("Service shutting. Some lambdas might still be running.");
}



