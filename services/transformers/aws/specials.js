const fs = require('fs')
var specials = require("./specials.json")

learn({"self": {
		"image": "anoop.jpg",
		"tags": ["Self"]
}}) 

//forget("siddu")

list()
 
function refresh(specials){
	fs.writeFileSync("./specials.json", JSON.stringify(specials))	
}

function learn(json){
	specials.push(json);
	refresh(specials)
}

function list(){
	specials.map(special => console.log(Object.keys(special)[0], Object.values(special)[0]))
}

function forget(entity){
	delete specials[0][entity]
	console.log(JSON.stringify(specials))
	refresh(specials)
} 	
