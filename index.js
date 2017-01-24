const sassVars = require('sass-vars');

module.exports = exports = function sassVarsLoader(content) {
  const callback = this.async();
  this.cacheable();

  return sassVars.render({ file: this.resourcePath })
  .then(rendered => {
    this.value = [rendered.vars];
    const result = `module.exports = ${JSON.stringify(rendered.vars)};`;
    
    rendered.stats.includedFiles.forEach(includedFile => {
      this.addDependency(includedFile);
    });

    callback(null, result);
  })
  .catch(err => {
    if(err.file) {
      this.addDependency(err.file);
    }
    callback(err);
  });
};