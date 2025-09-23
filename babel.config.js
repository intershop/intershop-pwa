module.exports = {
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
  env: {
    development: {
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
    },
    production: {
      plugins: [],
    },
  },
};
