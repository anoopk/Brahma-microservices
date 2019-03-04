const lambdaLocal = require('lambda-local');

exports.handler = async(event, context) => {
	if(context.lambdaImport != null && context.lambdaImport){
		const ex = require(context.lambdaPath);
		var snapshots = {};
		await ex.handler(event, {}).then(function(results, err){
			if(err)console.log("Error ", err);
			console.log(event.message);
			snapshots = results;
		});
		return snapshots;
	};		
	
	if(context.lambdaLocal != null && context.lambdaLocal){
		await lambdaLocal.execute({
			event: event,
			context: context,
			lambdaPath: context.lambdaPath,
			timeoutMs: 15000
		}).then(function(done) {
			console.log(context.message);
		});	
	}
}