//const config = require('./config.json').services
const urlReader = require('../services/readers/urlMetaData')
const lambdaLocal = require('lambda-local');

function main(){	
	urlReader.nextUrl("input/inputURLList.txt", {}, (urlObj) => {
		const server = require('./server.js');
		//config.transformers.transform = urlObj;
		lambdaLocal.execute({
			event: urlObj,
			lambdaPath: './server',
			timeoutMs: 13000
		}).then(function(done) {
			console.log(done);
		});			
	});
}

main();