'use strict';
const fs = require('fs')
var analysis = require('./analysis.json')		
		
async function annotate(img, option){
	const vision = require('@google-cloud/vision');
	const client = new vision.ImageAnnotatorClient();

	console.log(img, ": analysing for", option)
	var [result] = []
	var labels = {}
	
	if(option == 'logos'){		
		[result] = await client.logoDetection("images/" + img)
		labels = result.logoAnnotations
	}
	
	if(option == 'landmarks'){
		[result] = await client.landmarkDetection("images/" + img)
		labels = result.landmarkAnnotations
	}
	if(null == analysis[img]){
		analysis[img] = {}
	}			
	if((labels.length > 0) && null == analysis[img][option]){
		analysis[img][option] = []
	}		
	labels.forEach(label => analysis[img][option].push(label.description))	
}

exports.analyse = async function(entity){
	const config = require('./config.json').theOracle		
	fs.readdirSync("images").forEach(image =>{
		try{
			config.vision.aspects.map(aspect => annotate(image, aspect))
		}
		catch(err){
			console.log("There are some issues with the configuration.")
		}
	})
}



