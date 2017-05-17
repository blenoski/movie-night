const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

console.log('NODE_ENV=' + process.env.NODE_ENV)

module.exports = {
  // Tells webpack to set-up some Electron specific variables.
  target: 'electron-renderer',
  node: {
    __dirname: false
  },
  externals: {
    'winston': 'require("winston")'
  },
  // Generate source maps with original line numbers.
  devtool: 'cheap-module-eval-source-map',
  // This is the entry point for the React application.
  // In Electron, this is known as the renderer process.
  entry: {
    main: './app/renderer/index.js'
  },
  // This is where the bundled javascript file live.
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
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules injecting <style> tags, i.e.,
      // all the styles will be bundled inside the bundled javascript file.
      // This allows for nice dev things like hot module replacement.
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
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
      bundle: 'http://localhost:3000/bundle/bundle.js',
      css: '',
      inject: false
    })
  ]
}
