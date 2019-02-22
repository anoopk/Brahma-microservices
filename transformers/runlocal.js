const event = require('./event.json')
const transformer = require('./sd')

transformer.handler(event, {}).then(function(store, error){
	console.log("Gotcha", store);
});