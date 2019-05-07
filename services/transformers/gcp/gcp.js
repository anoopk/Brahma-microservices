'use strict';

// [START vision_quickstart]
exports.annotate = async function(img, options){
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');
  // Creates a client
  const client = new vision.ImageAnnotatorClient();
 
  // Performs detection on the image file
  if(options.logos)
  {
	const [result] = await client.logoDetection(img);
	const labels = result.logoAnnotations;
	labels.forEach(label => console.log(label.description));
  }
  if(options.landmarks)
  {
	const [result] = await client.landmarkDetection(img);
	const labels = result.landmarkAnnotations;
	labels.forEach(label => console.log(label.description));
  }
}






