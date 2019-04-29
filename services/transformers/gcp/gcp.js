'use strict';

// [START vision_quickstart]
async function quickstart(img) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.logoDetection(img);
  const labels = result.logoAnnotations;
  labels.forEach(label => console.log(label.description));
}

quickstart('./images/psg.jpg').catch(console.error);
