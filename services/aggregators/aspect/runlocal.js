const sd = require('./sd')
const fs = require('fs');

var snapshots = JSON.parse(fs.readFileSync('../../snapshots.json', 'utf8'));

sd.handler(snapshots.abs, {}, function(store, error){
	console.log("Gotcha", store);
});