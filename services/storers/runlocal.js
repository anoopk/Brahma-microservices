const mongo = require('./mongo')
const fs = require('fs');

var event = {};
event.snapshots = JSON.parse(fs.readFileSync('./snapshots.json', 'utf8'));
mongo.handler(event, {}).then(function(status, error){
	console.log(status);
});