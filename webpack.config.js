const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    './src/faussaire.js'
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'faussaire.js'
  },
  module: {
    loaders:[
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        loaders: ['babel-loader?presets[]=es2015&plugins[]=transform-object-rest-spread']
      }
    ]
  }
};