const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

console.log('NODE_ENV=' + process.env.NODE_ENV)

module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  // Tells webpack to set-up some Electron specific variables.
  target: 'electron-renderer',
  node: {
    __dirname: false
  },
  // We generate source maps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'cheap-module-source-map',
  // This is the entry point for the React application.
  // In Electron, this is known as the renderer process.
  entry: {
    main: './app/renderer/index.js'
  },
  // This is where the bundled javascript and CSS files live.
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      // Use babel to process javascript files.
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'app'),
          path.resolve(__dirname, 'config')
        ],
        loader: 'babel-loader'
      },
      // The notation here is somewhat confusing.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // But unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "css" loader
      // then grabs the result CSS and puts it into a
      // separate file in our build process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      }
    ]
  },
  resolve: {
    // Tell webpack where to search for JS modules.
    // This config is required if we want to include
    // 3rd party modules with source files located outside
    // of this project that rely on other modules inside of this project.
    // E.g., bootstrap.js required jquery.
    modules: [
      path.resolve(__dirname, 'app'),
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // This plugin takes the HTML template file and turns it
    // into the index.html file which serves as the entry point
    // for the renderer process.  The output index.html file is
    // located in the bundle/ directory alongside the bundled JS
    // and CSS file.
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'app', 'renderer', 'index-template.html'),
      bundle: 'bundle.js',
      css: '<link rel="stylesheet" href="bundle.css">',
      inject: false
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    // This plugin bundles all the CSS styles into a single .css file.
    // This is useful in production because the JS and CSS files can be loaded
    // in parallel.
    new ExtractTextPlugin('bundle.css')
  ]
}
