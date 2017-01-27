# sass-extract-loader basic example

This is a slightly more advanced example with a frontend application served by the webpack dev server with support for hot module replacement. D3 is used to make visualisation based on variables in sass files.

In this example there is also a `shared-variables.scss` file that is imported by other files in order to access shared variables across modules.

## Prepare

`npm install`

## Run

Start the webpack dev server using `npm start` and go to `http://localhost:8080` in your browser.

Try changing variables in the sass files and see the visualisations update in the running application.

