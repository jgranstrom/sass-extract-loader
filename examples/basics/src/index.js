const styleVariables = require('sass-extract-loader!./style.scss');
const prettyjson = require('prettyjson');

console.log('\n--- Style Varibles ---\n');
console.log(prettyjson.render(styleVariables));
console.log('\n')