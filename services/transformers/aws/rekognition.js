const AWS = require('aws-sdk');
const path = require("path");
const fs = require("fs");
const config = require('./config.json').theOracle


const analysisLocal = config.dataLocation + "analysis/entities/"
const BUCKET_NAME = "aggregators-dev-serverlessdeploymentbucket-pu393bpbga30"
AWS.config.update({region:'us-east-1'});

function getImageMetadata(){
  return new Promise((resolve, reject)=>{

    const imagesPath = path.join(__dirname, "../aws/Images/" + entity);
    console.log(`Reading images from ${imagesPath}`);

    fs.readdir(imagesPath, function(err, items) {  
      if (err){
        console.log(err, err.stack);
        reject(err);
        return;
      }

      resolve(items.map((i)=>{
        return {
          id : path.basename(i).toLocaleLowerCase(),
          filename: path.join(imagesPath, i)
        };
      }));

    });

  });
}

function getBucketObjectKeys(bucketName){
  const s3 = new AWS.S3();
  return new Promise((resolve, reject)=>{
    s3.listObjects({Bucket: bucketName, MaxKeys: 1000}, (err, data)=>{
      if (err){
        console.log(err, err.stack);
        reject(err);
        return;
      }

      resolve(data.Contents.map(c => c.Key));
    });
  });
}

function createIfNotExistsBucket(bucketName){
  const s3 = new AWS.S3();
  return new Promise((resolve, reject)=>{
    s3.listBuckets({}, (err, data)=>{
      if (err) {
        console.log(err, err.stack);
        reject(err);
        return;
      }

      console.log(`${data.Buckets.length} buckets`);
      for(const b of data.Buckets){
        if (b.Name === bucketName){
          console.log(`S3 Bucket ${bucketName} exists.`);
          getBucketObjectKeys(bucketName).then(resolve);
          return;
        }
      }

      const createOpts = {Bucket: bucketName, "ACL": "private", CreateBucketConfiguration: {LocationConstraint: "us-west-2"}};
      s3.createBucket(createOpts, (err, data)=>{
        if (err){
          console.log(err, err.stack);
          reject(err);
          return;
        }

        console.log(`Created S3 bucket ${bucketName}`);
        resolve([]);
      });

    });
  });
}

function readImage(filename){
  return new Promise((resolve, reject)=>{
    console.log(`Reading ${filename}`);
    const readable = fs.createReadStream(filename);
    const chunks = [];
    readable.on("data", (chunk)=>{
      chunks.push(chunk);
    }).on("error", (err) => {
      reject(err);
    }).on("end", _ => {
      const buffer = Buffer.concat(chunks);
      console.log(`Read ${buffer.length/1024} kb from image ${filename}.`);
      resolve(buffer);
    });    
  });
}

function uploadImage(bucketName, imageBuffer, imageMeta){
  const s3 = new AWS.S3();
  return new Promise((resolve, reject)=>{
    s3.upload({Bucket: BUCKET_NAME, Key: imageMeta.id, Body: imageBuffer, Folder: "PecFy"}, (err, data)=>{
      if (err){
        console.log(err, err.stack);
        reject(err);
        return;
      }
      console.log(`Uploaded ${imageMeta.id} to bucket ${bucketName}`);
      resolve(data);
    });  
  });
}

function detect(rek, bucketName, imageMeta, entity){
	return new Promise((resolve, reject)=>{
		rek.compareFaces({
				SourceImage: {
					S3Object: {
					Bucket: bucketName, 
					Name: imageMeta.id
					}
				},
				TargetImage: {
					S3Object: {
					Bucket: bucketName, 
					Name: entity + '.jpg'
					}
				}  	  
			}, (err, data) => {
			if (err){
				console.log(entity + " not detected in " + imageMeta.id)
				//reject(err);
				return;
			}
			
			if(data.FaceMatches.length){
							if(null == analysis[imageMeta.id]){
								analysis[imageMeta.id] = {}
								analysis[imageMeta.id].specials	= []				
							}					

							if(analysis[imageMeta.id].specials	= []){
								analysis[imageMeta.id].specials	= []				
							}									
							analysis[imageMeta.id].specials.push(entity)
							
							try{
								fs.writeFileSync(analysisLocal + entity + "/analysis.json", JSON.stringify(analysis))
							}
							catch(err){
								console.log("My fault. Analysis file missing for", entity)
							}
							resolve(data)		
						}				
					});
				})		
			}

var analysis = {}
const aspects = ['specials', 'texts', 'labels']

function recognize(bucketName, imageMeta, aspect){
	var details = {
	  Image: {
		S3Object: {
		  Bucket: bucketName, 
		  Name: imageMeta.id
		}
	  },
	};
	
	const rek = new AWS.Rekognition();
	return new Promise((resolve, reject)=>{		
		if(aspect == 'specials'){
			console.log(imageMeta.id, ": Analysing image for presence of other specials");
			const specials = require(config.dataLocation + "knowledge.json").specials
			
			Promise.all(specials.map(entity	=> {
				detect(rek, bucketName, imageMeta, entity, (err, data) => {
					console.log("Specials resolved")
					if(data) resolve(true)
				})
			})
		)}
				
		if(aspect == 'labels'){			
			rek.detectLabels(details, (err, data) => {
				if (err){
					console.log(err, err.stack);
					reject(err);
					return;
				} 
				console.log(imageMeta.id, ": Labeling image");
				const labels = data.Labels.map(l => l.Name)
				if(null == analysis[imageMeta.id])
					analysis[imageMeta.id] = {}					
				analysis[imageMeta.id].labels = labels
				resolve(labels);
			});	
		}
		
		if(aspect == 'texts'){			
			rek.detectText(details, (err, data) => {
				if (err){
					console.log(err, err.stack);
					reject(err);
					return;
				} 
				console.log(imageMeta.id, ": Performing  textdetections");
				const labels = data.TextDetections.map(l => l.Name)
				if(null == analysis[imageMeta.id])
					analysis[imageMeta.id] = {}					
				analysis[imageMeta.id].texts = labels
				resolve(labels);
			});	
		}		
	});  				
}

function processImages(images, bucketObjectKeys){
  return Promise.all(images.map((imageMeta) => new Promise((resolve, reject)=>{

    if (bucketObjectKeys.indexOf(imageMeta.id) >= 0){
      //console.log(`Image ${imageMeta.id} already exists.`);
      resolve();
      return;
    };
    
    return readImage(imageMeta.filename)
      .then(imgBuffer => uploadImage(BUCKET_NAME, imgBuffer, imageMeta))
      .then(resolve)
      .catch(err => {
        reject(err);
      });

  }))).then(_=> images);
}

function labelImages(images){
  console.log("\n",)
  console.log("Analysis Started for", entity)
  console.log("\nA local copy of the analysis is in", analysisLocal + entity + "/analysis.json")
  console.log("\n",)
	
  return Promise.all(images.map(imageMeta => {
		Promise.all(aspects.map(aspect => 
			recognize(BUCKET_NAME, imageMeta, aspect)
			.then(data => {
				try{
					var err = fs.mkdirSync(analysisLocal + entity, { recursive: true })
				}
				catch (err){
				}	
				fs.writeFileSync(analysisLocal + entity + "/analysis.json", JSON.stringify(analysis))				
				return analysis
			})
		))
	})
)}

/*
Create an S3 bucket if one doesn't exist
Upload all images to the S3 bucket. 
Only upload images that don't already exist.
Recognize labels for each image
*/
var entity
exports.analyse = special => {
	entity = special
	Promise.all([getImageMetadata(), createIfNotExistsBucket(BUCKET_NAME)]).then((results)=>{
	  const [images, bucketObjectKeys] = results;
	  return processImages(images, bucketObjectKeys)
		.then(labelImages)
		.then(_=> {
		});

	}).catch(err => {
		console.log(err);
	});	
}

