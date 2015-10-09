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
        './src/components/main.js'
    ],
    vendor: Object.keys(
        packageJSON.dependencies
    )
  },

  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
    root: path.resolve(__dirname, 'src'),
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
      exclude: /node_modules/,
      loader: 'react-hot!babel-loader'
    }, {
      test: /\.styl/,
      loader: 'style-loader!css-loader!stylus-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.wav$/,
      loader: 'file-loader'
    }]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
  ]

};
