const event = require('./event.json')
const sd = require('./sd')

sd.handler(event.snapshots[2], {}, function(store, error){
	console.log("Gotcha", store);
});