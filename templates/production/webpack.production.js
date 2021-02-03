var path = require('path');

module.exports = config => {
  // splitChunks not available for SSR build
  if (config.optimization.splitChunks) {
    const cacheGroups = config.optimization.splitChunks.cacheGroups;
    cacheGroups.default.minChunks = 10;
    cacheGroups.common.minChunks = 1;
    cacheGroups.common.priority = 20;
  }

  const angularPluginIndex = config.plugins.findIndex(
    p => typeof p && p.constructor && p.constructor.name === 'AngularCompilerPlugin'
  );

  if (angularPluginIndex > 0) {
    config.plugins[angularPluginIndex]._options.directTemplateLoading = false;

    config.module.rules.push({ test: /\.html$/, loader: 'raw-loader' });
    config.module.rules.push({
      test: /\.html$/,
      use: [
        {
          loader: path.join(__dirname, 'data-testing-id-loader.js'),
        },
      ],
    });
  } else {
    console.warn('Could not find AngularCompilerPlugin, output will contain "data-testing" attributes!');
  }

  return config;
};
