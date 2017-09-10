# sass-extract-loader

[![Build Status](https://travis-ci.org/jgranstrom/sass-extract.svg?branch=master&style=flat)](https://travis-ci.org/jgranstrom/sass-extract-loader)
[![npm version](https://badge.fury.io/js/sass-extract-loader.svg)](http://badge.fury.io/js/sass-extract-loader)
[![dependencies Status](https://david-dm.org/jgranstrom/sass-extract-loader/status.svg)](https://david-dm.org/jgranstrom/sass-extract-loader)
[![devDependencies Status](https://david-dm.org/jgranstrom/sass-extract-loader/dev-status.svg)](https://david-dm.org/jgranstrom/sass-extract-loader?type=dev)
[![peerDependencies Status](https://david-dm.org/jgranstrom/sass-extract-loader/peer-status.svg)](https://david-dm.org/jgranstrom/sass-extract-loader?type=peer)

Webpack loader for [sass-extract](https://github.com/jgranstrom/sass-extract).

Require sass files as modules containing the variables defined in those files. Supports `@include` directives for extracting variables across multiple files.

This does **not** replace the [sass-loader](https://github.com/jtangelder/sass-loader) for requiring sass in order to generate css, but serves as an additional tool in order to use variables defined in sass in your javascript modules.

[![demo.gif](https://s27.postimg.org/w40sdzqjn/demo.gif)](https://postimg.org/image/oba4m0kkf/)

## Install

You need to install the sass compiler, sass-extract and the loader since they are all [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/).

```
npm install --save node-sass sass-extract sass-extract-loader
```

## Usage

##### Recommended

The recommended usage is to use the loader explicitly when requiring `.sass` or `.scss` files since you are likely to have separate loader for generating the css for your app from the same sass files.

```
const style = require('sass-extract-loader!./style.scss');

/*
style ==> {
  global: {
    $variable: <value>
    ..
  }
}
*/
```

##### Alternative

You can add the loader in your webpack configuration file as expected.

```
{
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'sass-extract-loader'
      }
    ]
  }
}
```

Note that this alternative might not be a good choice as you likely want the default behavior of requiring a sass files to be generating css from it. However, you might have a case when you want to use certain files as runtime variables to be handled by the sass-extract-loader by default.

```
{
  module: {
    loaders: [
      {
        test: /\.runtime\.scss$/,
        loader: 'sass-extract-loader'
      }
    ]
  }
}
```

The resulting module will be a plain JSON object containing the extracted variables and their values. For detailed documentation on the structure and semantics of the response head over to the documentation for [sass-extract](https://github.com/jgranstrom/sass-extract).

## Options

All options available for `node-sass` can be passed to the loader with any of the available methods for webpack.

An example is including a path for resolving imports such as `const styleVariables = require('sass-extract-loader?{"includePaths": ["./foobar"]}!./style.scss');`.

## Plugins

Plugins can be used by passing plugin module names in the query options to the loader `const styleVariables = require('sass-extract-loader?{"plugins": ["minimal"]}!./style.scss');`.

## Examples

Head over to the [examples](examples) section to see available examples. Simply clone this repository and follow the simple instructions within each example directory to try them out.

## Requirements
- `node-sass >= 3.8.0`
- `node >= 4`

## Contributing

##### Running tests

```bash
npm test
```

##### Commits

In order to have readable commit messages and the ability to generate a changelog the commit messages should follow a certain structure.

To make it easier install `npm install -g commitizen` and commit using `git-cz`.

Generate changelog using `npm install -g conventional-changelog` and `npm run changelog`.

##### Releasing new versions

1. Make changes
2. Commit those changes
4. Set new version in package.json
5. `npm run changelog`
6. Commit package.json and CHANGELOG.md files
7. Tag
8. Push