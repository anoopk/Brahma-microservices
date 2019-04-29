'use strict';

// [START vision_quickstart]
async function quickstart() {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.landmarkDetection('./images/psg.jpg');
  const labels = result.landmarkAnnotations;
  labels.forEach(label => console.log(label.description));
}
// [END vision_quickstart]

quickstart().catch(console.error);
