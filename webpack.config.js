/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */
'use strict';
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var packageJSON = require('./package.json');

module.exports = {

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  cache: true,
  debug: true,
  devtool: 'cheap-module-sourcemap',
  devServer: {
    contentBase: 'dist/',
    port: 8000
  },

  entry: {
    main: [
        //'webpack/hot/only-dev-server',
        './components/main.js'
    ],
    vendor: Object.keys(
        packageJSON.dependencies
    )
  },

  stats: {
    colors: true,
    reasons: true
  },

  context: path.resolve(__dirname, 'src'),
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'styles': __dirname + '/src/styles',
      'mixins': __dirname + '/src/mixins',
      'components': __dirname + '/src/components/',
      'vendor': __dirname + '/src/vendor/',
      'sounds': __dirname + '/src/sounds/',
      'stores': __dirname + '/src/stores/',
      'actions': __dirname + '/src/actions/'
    }
  },

  module: {
    preLoaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'react-hot!babel-loader',
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src', 'worker')
      ]
    }, {
      loader: 'file-loader?name=[path][name].[ext]',
      include: [
        path.resolve(__dirname, 'src', 'worker'),
        path.resolve(__dirname, 'src', 'fonts'),
        path.resolve(__dirname, 'src', 'sounds')
      ]
    }, {
      test: /\.styl/,
      loader: 'style-loader!css-loader!stylus-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpg|svg)$/,
      loader: 'url-loader?limit=8192',
      exclude: path.resolve(__dirname, 'src', 'fonts')
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
  ]

};
