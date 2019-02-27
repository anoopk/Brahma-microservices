const fs = require('fs');
const sd = require('./sd')


var snapshots = JSON.parse(fs.readFileSync('../../snapshots.json', 'utf8'));

sd.handler(snapshots.sentiment, {}, function(store, error){
	console.log("Gotcha", store);
});