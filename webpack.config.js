const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

console.log('NODE_ENV=' + process.env.NODE_ENV)

const bundleName = (process.env.NODE_ENV === 'production'
  ? 'bundle.js'
  : 'http://localhost:3000/dist/bundle.js')
console.log('Using bundled javascript source: ', bundleName)

module.exports = {
  entry: {
    main: './app/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'app')
        ],
        loader: 'babel-loader',
        options: {
          presets: [['env', {'modules': false}], 'react']
        }
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'app', 'index-template.html'),
      bundle: bundleName,
      inject: false
    })
  ]
}
