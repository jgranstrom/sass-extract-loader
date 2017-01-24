// NOTE: replace '../../../index.js' with 'sass-vars-loader' in your projects
const styleVariables = require('../../../index.js!./style.scss');
const prettyjson = require('prettyjson');

console.log('\n--- Style Varibles ---\n');
console.log(prettyjson.render(styleVariables));
console.log('\n')