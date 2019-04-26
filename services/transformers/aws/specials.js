const fs = require('fs')
var specials = require("./specials.json").specials

learn({"siddu": {
		"image": "siddu.jpg",
		"tags": ["Frend", "Siddhartha Sharma"]
}}) 

forget("messi")
 
function refresh(specials){
	fs.writeFileSync("./specials.json", JSON.stringify(specials))	
}

function learn(json){
	specials.push(json);
}

function forget(entity){
	delete specials[0][entity]
	console.log(JSON.stringify(specials))
	refresh(specials)
} 	
