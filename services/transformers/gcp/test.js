const gcp = require('./gcp.js')

gcp.then(function(store, error){
	console.log("Gotcha", store);
});