const mongo = require('./mongo')
const fs = require('fs');

var event = {};
event.snapshots = JSON.parse(fs.readFileSync('../upstreamSentiment.json', 'utf8'));
mongo.handler(event, {}).then(function(store, error){
	console.log("Gotcha", store);
});