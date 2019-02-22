const event = require('./event.json')
const sd = require('./sd')

sd.handler(event, {}, function(store, error){
	console.log("Gotcha", store);
});