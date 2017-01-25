# sass-vars-loader

Webpack loader for [sass-vars](https://github.com/jgranstrom/sass-vars).

Require sass files as modules containing the variables defined in those files. Supports `@include` directives for extracting variables across multiple files.

This does **not** replace the [sass-loader](https://github.com/jtangelder/sass-loader) for requiring sass in order to generate css, but serves as an additional tool in order to use variables defined in sass in your javascript modules.

## Install

You need to install the sass compiler, sass-vars and the loader since they are all [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/).

```
npm install --save node-sass sass-vars sass-vars-loader
```

## Usage

##### Recommended

The recommended usage is to use the loader explicitly when requiring `.sass` or `.scss` files since you are likely to have separate loader for generating the css for your app from the same sass files.

```
const style = require('sass-vars-loader!./style.scss');

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
        loader: 'sass-vars-loader'
      }
    ]
  }
}
```

Note that this alternative might not be a good choice as you likely want the default behavior of requiring a sass files to be generating css from it. However, you might have a case when you want to use certain files as runtime variables to be handled by the sass-vars-loader by default.

```
{
  module: {
    loaders: [
      {
        test: /\.runtime\.scss$/,
        loader: 'sass-vars-loader'
      }
    ]
  }
}
```

The resulting module will be a plain JSON object containing the extracted variables and their values. For detailed documentation on the structure and semantics of the response head over to the documentation for [sass-vars](https://github.com/jgranstrom/sass-vars).

## Examples

Head over to the [examples](examples) section to see available examples. Simply clone this repository and follow the simple instructions within each example directory to try them out.