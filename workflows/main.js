'use strict'

const sm = require('./transform.js')
sm.start({}, {}, (err, result) => {
		console.log(result);
});
