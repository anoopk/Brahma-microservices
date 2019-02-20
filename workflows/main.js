'use strict'

const sm = require('./step')
sm.start({}, {}, (err, result) => {
		console.log(result);
});
