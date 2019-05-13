'use strict';

var analysis = JSON.parse('{}')

exports.annotate = async function(img, options){
	const vision = require('@google-cloud/vision');
	const client = new vision.ImageAnnotatorClient();

	if(options == 'logos'){
		console.log(img, ": analysing for logos")
		const [result] = await client.logoDetection(img)
		const labels = result.logoAnnotations
		labels.forEach(label => console.log(label));
	}
	
	if(options == 'landmark'){
		console.log(img, ": analysing for landmarks")
		const [result] = await client.landmarkDetection(img)
		const labels = result.landmarkAnnotations
		if(null == analysis[img]){
			analysis[img] = {}
		}			
		if((labels.length > 0) && null == analysis[img].landmarks){
			analysis[img].landmarks = []
		}		
		labels.forEach(label => analysis[img].landmarks.push(label.description))
		console.log(analysis)
	}
}

exports.analyse = async function(img){
	try{
		const config = require('./config.json').theOracle	
		config.aspects.map(aspect => exports.annotate("fjords.jpg", aspect))
	}
	catch(err){
		console.log("There are some issues with the configuration.")
	}
}



