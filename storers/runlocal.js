const config = require('../workflows/config.json')
const mongo = require('./mongo')

mongo.handler(config.services.storers.mongodb, {}).then(function(store, error){
	console.log("Gotcha", store);
});