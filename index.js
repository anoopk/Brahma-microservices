#!/usr/bin/env node

const program = require('commander');

let listFunction = (directory,options) => {
const cmd = 'ls';
let params = [];
if (options.all) params.push('a');
if (options.long) params.push('l');
let fullCommand = params.length 
                  ? cmd + ' -' + params.join('')
                  : cmd
if (directory) fullCommand += ' ' + directory;
};

program
.version('0.0.1')
.command('profile NAME [optional]','Profiles the entity')
.command('list [NAME]', 'command2 description')
.command('learn','command3 description')
.action(listFunction)
.parse(process.argv);