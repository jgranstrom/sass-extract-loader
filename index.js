const sassExtract = require('sass-extract');

module.exports = exports = function sassExtractLoader(content) {
  const callback = this.async();
  this.cacheable();

  return sassExtract.render({ file: this.resourcePath })
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