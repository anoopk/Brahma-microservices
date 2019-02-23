const event = require('./event.json')
const sd = require('./handler')

sd.handler(event[0], {}, function(store, error){
	console.log("Gotcha", store);
});