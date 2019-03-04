'use strict';
var fs = require('fs');

exports.handler = async(event, context) => {	
	var snapshots = event;
	if(context.append){
		await fs.appendFile(context.filename, JSON.stringify(event), (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});		
	}
	else{
		await fs.writeFile(context.filename, JSON.stringify(snapshots), (error) => {		
			if(error)	
				console.log("Error writing analysis data to local file");
		});
	}
	console.log(context.filename, " has a copy of the mongo data snapshot");
}