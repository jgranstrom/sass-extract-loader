# sass-extract-loader with-options example

This examples shows how one can pass options to the `node-sass` compilation process through the loader.

The `foobar` directory is in this case included in the `includePaths` and can thus be imported without the full path.

## Prepare

`npm install`

## Run

Build and run the module using `npm start` and see the variables in `./src/style.scss` being printed to the console.

Run `npm run watch` in order to start watching the code. Run it and try changing variables in `./src/style.scss` to see changes in the console.
