const config = require('./config.json')
const transformer = require('./sd')

transformer.handler(config.transfomers, {}).then(function(store, error){
	console.log("Gotcha", store);
});