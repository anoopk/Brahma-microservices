'use strict'

const sm = require('./mongo.js')
sm.start({}, {}, (err, result) => {
		console.log(result);
});
