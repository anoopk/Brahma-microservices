const sd = require('./sd')
const fs = require('fs');

var event = {};
var snapshots = JSON.parse(fs.readFileSync('../../snapshots.json', 'utf8'));
event.snapshots = snapshots['abs'];
event.snapshots.endpoint = 'abs';

sd.handler(event, {}, function(store, error){
	console.log("Gotcha", store);
});