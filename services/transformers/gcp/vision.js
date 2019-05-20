'use strict';
const fs = require('fs')
const config = require('./config.json').pecfy
		
async function annotate(entity, img, aspect){
	img = img.toLowerCase()
	const vision = require('@google-cloud/vision');
	const client = new vision.ImageAnnotatorClient();

	console.log(img, ": analysing for", aspect)
	var [result] = []
	var labels = {}
	var safe = false
	
	if(aspect == 'logos'){		
		[result] = await client.logoDetection("../images/" + entity + '/' + img)
		labels = result.logoAnnotations
	}

	if(aspect == 'texts'){		
		[result] = await client.textDetection("../images/" + entity + '/' + img)
		labels = result.textAnnotations
	}
	
	if(aspect == 'objects'){
		[result] = await client.objectLocalization("../images/" + entity + '/' + img)
		labels = result.localizedObjectAnnotations
	}
	
	if(aspect == 'landmarks'){
		[result] = await client.landmarkDetection("../images/" + entity + '/' + img)
		labels = result.landmarkAnnotations
	}

	if(aspect == 'safeSearch'){
		[result] = await client.safeSearchDetection("../images/" + entity + '/' + img)
		safe = ((result.safeSearchAnnotation.adult == 'VERY_UNLIKELY' || result.safeSearchAnnotation.adult == 'UNLIKELY') &&
				(result.safeSearchAnnotation.racy == 'VERY_UNLIKELY' || result.safeSearchAnnotation.racy == 'UNLIKELY') &&
				(result.safeSearchAnnotation.violence == 'VERY_UNLIKELY' || result.safeSearchAnnotation.violence == 'UNLIKELY'))
			? true : false
			if(safe == false)
				console.log(img, "found to be unsafe", result.safeSearchAnnotation)		
	}
	
	var analysis = require(config.dataLocation + 'analysis/entities/' + entity + '/analysis.json')
	if(null == analysis[img]){
		analysis[img] = {}
	}		
	
	if(labels.length > 0){
		analysis[img][aspect] = []
	}		
	
	if(aspect == 'safeSearch'){
		if(null == analysis[img][aspect])
			analysis[img][aspect] = []
		
		analysis[img][aspect] = safe
	}
	else{
		labels.forEach(label => analysis[img][aspect].push(label.description))	
	}
	
	try{
		fs.writeFileSync(config.dataLocation + 'analysis/entities/' + entity + '/analysis.json', JSON.stringify(analysis))
	}
	catch(err){
		console.log("Issue with config")
	}
}

exports.analyse = async function(entity){
	const config = require('./config.json').pecfy
	fs.readdirSync("../images/" + entity).forEach(image =>{
		try{
			config.vision.aspects.map(aspect =>	annotate(entity, image, aspect))
		}
		catch(err){
			console.log("There are some issues with the configuration.")
		}
	})
}



