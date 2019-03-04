const config = require('./config.json').services
const ex = require('./executor.js')

exports.handler = async(event, context) => {	
	//Send URL text to Aylien API analyse for Classification of subject, Sentiment, Aspect Based Sentiments and Entity Detection.
	//Transform the return JSON 
	await ex.handler(event, config.transformers).then(async function(snapshots, error) {
		const mongo = require('../services/storers/mongo');		
		ex.handler({"snapshots": snapshots}, config.storers.mongodb);
				
		//Log the Aylien snapshots locally
		const logger = require('../services/storers/logger');		
		logger.handler(snapshots, {"append": "true", "filename": "./aylienized.json"}).then((result) => {
			console.log("Local copies of data made.");
		});
	
		//ex.handler({"snapshots": snapshots.sentiment}, config.aggregators.sentiment, (results) => {
		//	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>  ", result);			
		//});
		
		ex.handler({"snapshots": snapshots.abs}, config.aggregators.aspect, (results) => {
			console.log(config.aggregators.aspect.message);
		});
		console.log("tsts up");
		//var mongo = require('../services/storers/mongo');
		//config.aggregators.strangedesigns.snapshots = result;
		//config.aggregators.strangedesigns.db = config.storers.mongodb.databases.aggregate;
		//mongo.handler(config.aggregators.strangedesigns, {}, () => {console.log("Data moved to Mongo")});
	});
	return("Service shutting. Some lambdas might still be running.");
}



