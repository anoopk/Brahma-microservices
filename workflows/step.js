'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const stepfunctions = new AWS.StepFunctions();

module.exports.start = (event, context, callback) => {
  const input = JSON.stringify(require("./config.json"));
  const stateMachineArn = "arn:aws:states:us-east-1:078421894314:stateMachine:Transform";
  const params = {
	input.services, 
    stateMachineArn
	}
  console.log(params);
  return stepfunctions.startExecution(params).promise().then(() => {
    callback(null, `Your statemachine ${stateMachineArn} executed successfully`);
  }).catch(error => {
    callback(error.message);
  });
};

