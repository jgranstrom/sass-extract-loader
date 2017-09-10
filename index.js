const sassExtract = require('sass-extract');
const loaderUtils = require('loader-utils');
const path = require('path');

function normalizeDependency(dep) {
  if(path.posix.isAbsolute(dep)) {
    return dep;
  } else {
    return path.posix.join(process.cwd(), dep);
  }
}

module.exports = exports = function sassExtractLoader(content) {
  const callback = this.async();
  this.cacheable();

  const query = loaderUtils.getOptions(this);;
  const plugins = (query ? query.plugins : []) || [];

  return sassExtract.render(Object.assign({}, query, { file: this.resourcePath }), { plugins })
  .then(rendered => {
    this.value = [rendered.vars];
    const result = `module.exports = ${JSON.stringify(rendered.vars)};`;
    
    rendered.stats.includedFiles.forEach(includedFile => {
      this.addDependency(normalizeDependency(includedFile));
    });

    callback(null, result);
  })
  .catch(err => {
    if(err.file) {
      this.addDependency(normalizeDependency(err.file));
    }
    callback(err);
  });
};