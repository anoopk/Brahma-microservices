const event = require('./event.json')
const sd = require('./sd')

sd.handler(event[0], {}, function(store, error){
	console.log("Gotcha", store);
});