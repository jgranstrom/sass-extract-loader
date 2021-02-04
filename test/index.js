const chai = require('chai');
const expect = chai.expect;
const runTest = require('./run-test')
const path = require('path');

describe('sass-vars-loader', () => {
  it('should succesfully compile basic variables', () => {
    return runTest('./scss/basic.scss')
    .then((results) => {
      const compiled = results.compiled;
      const stats = results.stats;

      expect(compiled).to.be.a('object');
      expect(compiled).to.have.property('global');
      expect(compiled.global).to.have.keys(['$a', '$b', '$c', '$d', '$e', '$f']);
      const source = path.resolve(__dirname, './scss/basic.scss');

      expect(compiled.global.$a.sources).to.have.members([source]);
      expect(compiled.global.$b.sources).to.have.members([source]);
      expect(compiled.global.$c.sources).to.have.members([source]);
      expect(compiled.global.$d.sources).to.have.members([source]);
      expect(compiled.global.$e.sources).to.have.members([source]);
      expect(compiled.global.$f.sources).to.have.members([source]);

      expect(Array.from(stats.compilation.fileDependencies)).to.include.members([source]);
    });
  });

  it('should succesfully compile nested variables', () => {
    return runTest('./scss/nested.scss')
    .then((results) => {
      const compiled = results.compiled;
      const stats = results.stats;
      
      expect(compiled).to.be.a('object');
      expect(compiled).to.have.property('global');
      expect(compiled.global).to.have.keys(['$a', '$b', '$c', '$d', '$e', '$f']);
      const sourceRoot = path.resolve(__dirname, './scss/nested.scss');
      const sourceSub1 = path.resolve(__dirname, './scss/sub/sub1.scss');
      const sourceSub2 = path.resolve(__dirname, './scss/sub/sub2.scss');

      expect(compiled.global.$a.sources).to.have.members([sourceRoot]);
      expect(compiled.global.$b.sources).to.have.members([sourceRoot]);
      expect(compiled.global.$c.sources).to.have.members([sourceRoot]);
      expect(compiled.global.$d.sources).to.have.members([sourceSub1]);
      expect(compiled.global.$e.sources).to.have.members([sourceSub2]);
      expect(compiled.global.$f.sources).to.have.members([sourceSub2]);

      expect(Array.from(stats.compilation.fileDependencies)).to.include.members([sourceRoot, sourceSub1, sourceSub2]);
    });
  });

  it('should succesfully track dependencies on error', () => {
    return runTest('./scss/error.scss')
    .catch(err => {
      const source = path.resolve(__dirname, './scss/error.scss');
      expect(Array.from(err.stats.compilation.fileDependencies)).to.include.members([source]);
    });
  });

  it('should succesfully track included dependencies on nested error', () => {
    return runTest('./scss/nested-error.scss')
    .catch(err => {
      const sourceRoot = path.resolve(__dirname, './scss/nested-error.scss');
      const sourceSub = path.resolve(__dirname, './scss/sub/error.scss');
      expect(Array.from(err.stats.compilation.fileDependencies)).to.include.members([sourceRoot, sourceSub]);
    });
  });

  it('should succesfully include files from includePaths', () => {
    return runTest('./scss/include.scss', {"includePaths": ["./test/scss/include"]})
    .then(results => {
      const compiled = results.compiled;
      const stats = results.stats;

      expect(compiled).to.be.a('object');
      expect(compiled).to.have.property('global');
      expect(compiled.global).to.have.keys(['$included', '$origin']);

      const sourceRoot = path.resolve(__dirname, './scss/include.scss');
      const sourceIncluded = path.resolve(__dirname, './scss/include/included.scss');

      expect(Array.from(stats.compilation.fileDependencies)).to.include.members([sourceRoot, sourceIncluded]);
    });
  });

  it('should succesfully use minimal plugin', () => {
    return runTest('./scss/basic.scss', {"plugins": ["minimal"]})
    .then(results => {
      const compiled = results.compiled;
      const stats = results.stats;

      expect(compiled).to.be.a('object');
      expect(compiled).to.have.property('global');
      expect(compiled.global).to.have.keys(['$a', '$b', '$c', '$d', '$e', '$f']);
      const source = path.resolve(__dirname, './scss/basic.scss');

      expect(compiled.global.$a).to.equal('100px');
      expect(compiled.global.$b).to.equal('200px');
      expect(compiled.global.$c).to.equal('red');
      expect(compiled.global.$d).to.equal('1px solid black');
      expect(compiled.global.$e).to.equal('string');

      expect(Array.from(stats.compilation.fileDependencies)).to.include.members([source]);
    });
  });
});