'use strict';
const fs = require('fs')
var analysis = require('./analysis.json')		
		
async function annotate(img, options){
	const vision = require('@google-cloud/vision');
	const client = new vision.ImageAnnotatorClient();

	if(options == 'logos'){
		console.log(img, ": analysing for logos")
		const [result] = await client.logoDetection("images/" + img)
		const labels = result.logoAnnotations
		if(null == analysis[img]){
			analysis[img] = {}
		}			
		if((labels.length > 0) && null == analysis[img].logos){
			analysis[img].logos = []
		}		
		labels.forEach(label => analysis[img].logos.push(label.description))		
	}
	
	if(options == 'landmarks'){
		console.log(img, ": analysing for landmarks")
		const [result] = await client.landmarkDetection("images/" + img)
		const labels = result.landmarkAnnotations
		if(null == analysis[img]){
			analysis[img] = {}
		}			
		if((labels.length > 0) && null == analysis[img].options){
			analysis[img].options = []
		}		
		labels.forEach(label => analysis[img].options.push(label.description))
	}
}

exports.analyse = async function(entity){
	const config = require('./config.json').theOracle		
	fs.readdirSync("images").forEach(image =>{
		try{
			config.aspects.map(aspect => annotate(image, aspect))
		}
		catch(err){
			console.log("There are some issues with the configuration.")
		}
	})
}



