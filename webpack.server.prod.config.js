const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports = merge(require('./webpack.server.config.js'), {
  plugins: [
    // https://github.com/webpack/docs/wiki/list-of-plugins#uglifyjsplugin
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: false,
      compress: {
        warnings: false,
        //drop_console: true
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]
})
