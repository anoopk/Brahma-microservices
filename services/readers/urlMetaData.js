var lr = require('line-reader');

function nextUrl(fileName, {}, callback){
	console.log(fileName);
	lr.eachLine(fileName, function(url, last){
		var data = url.split(" ");
		var infoObj = {};
		infoObj.url = data[0];
		infoObj.organization = data[1];
		infoObj.product = data[2];
		
		callback(infoObj);
	});
}

module.exports.nextUrl = nextUrl;





