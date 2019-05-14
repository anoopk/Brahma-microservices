'use strict';
const fs = require('fs')
const config = require('./config.json').pecfy
		
async function annotate(entity, img, aspect){
	const vision = require('@google-cloud/vision');
	const client = new vision.ImageAnnotatorClient();

	console.log(img, ": analysing for", aspect)
	var [result] = []
	var labels = {}
	
	if(aspect == 'logos'){		
		[result] = await client.logoDetection("images/" + entity + '/' + img)
		labels = result.logoAnnotations
	}
	
	if(aspect == 'landmarks'){
		[result] = await client.landmarkDetection("images/" + entity + '/' + img)
		labels = result.landmarkAnnotations
	}

	var analysis = require(config.dataLocation + 'analysis/entities/' + entity + '/analysis.json')
	if(null == analysis[img]){
		analysis[img] = {}
	}			
	if((labels.length > 0) && null == analysis[img][aspect]){
		analysis[img][aspect] = []
	}		
	labels.forEach(label => analysis[img][aspect].push(label.description))	
	try{
		fs.writeFileSync(config.dataLocation + 'analysis/entities/' + entity + '/analysis.json', JSON.stringify(analysis))
	}
	catch(err){
		console.log("Issue with config")
	}
}

exports.analyse = async function(entity){
	const config = require('./config.json').pecfy
	fs.readdirSync("images/" + entity).forEach(image =>{
		try{
			config.vision.aspects.map(aspect =>	annotate(entity, image, aspect))
		}
		catch(err){
			console.log("There are some issues with the configuration.")
		}
	})
}



