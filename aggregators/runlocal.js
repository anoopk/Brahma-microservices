
const sd = require('./sd')

sd.handler({}, {}, function(store, error){
	console.log("Gotcha", store);
});