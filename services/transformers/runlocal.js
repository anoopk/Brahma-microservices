const event = require('./event.json')
const transformer = require('./sd')
const assert = require("assert")

transformer.handler(event.transform, {}).then(function(store, error){
	const fs = require('fs');	
	try{
		assert.equal(store.abs.metadata.organization, "Maruti");
	}
	catch(err){
		console.log(err);
	}
	fs.writeFileSync("./snapshots.json", JSON.stringify(store));		
})