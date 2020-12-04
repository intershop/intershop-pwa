var path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.html/,
        use: [
          {
            loader: 'data-testing-id-loader',
          },
        ],
      },
    ],
  },
  resolveLoader: {
    alias: {
      'data-cy-loader': path.join(__dirname, 'data-testing-id-loader.js'),
    },
  },
};
