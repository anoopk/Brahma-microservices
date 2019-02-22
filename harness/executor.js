const lambdaLocal = require('lambda-local');

exports.handler = async(event, context) => {
	if(event.lambdaImport){
		const ex = require(event.lambdaPath);
		var snapshots = {};
		await ex.handler(event, context).then(function(results, err){
			if(err)console.log("Error ", err);
			console.log(event.message);
			snapshots = results;
		});
		return snapshots;
	};		
	
	if(event.lambdaLocal){
		await lambdaLocal.execute({
			event: event,
			context: context,
			lambdaPath: event.lambdaPath,
			timeoutMs: event.timeOut
		}).then(function(done) {
			console.log(event.message);
		});	
	}
}