const event = require('./event.json')
const transformer = require('./sd')

transformer.handler(event.transform, {}).then(function(store, error){
	const fs = require('fs');
	fs.writeFileSync("./snapshots.json", JSON.stringify(store));	
})