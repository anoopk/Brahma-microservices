var gcloud = require('gcloud')({
  keyFilename: './Brahma Vision-de8d092d75de.json',
  projectId: 'Brahma Vision'
});

var vision = gcloud.vision();

var image = 'fjords.jpg';

vision.detectText('image.jpg', function(err, text, apiResponse) {
  // text = ['This was text found in the image']
});