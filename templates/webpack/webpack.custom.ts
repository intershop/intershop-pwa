import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import { AngularCompilerPlugin } from '@ngtools/webpack';
import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';
import * as webpack from 'webpack';

const log = (...txt) => {
  // tslint:disable-next-line: no-console
  console.log('Custom Webpack:', ...txt);
};

export default (config: webpack.Configuration, _: CustomWebpackBrowserSchema, targetOptions: TargetOptions) => {
  const configurations = targetOptions.configuration.split(',');
  const production = configurations.includes('production');
  const specificConfigurations = configurations.filter(x => x !== 'production');
  if (specificConfigurations.length > 1) {
    console.warn('cannot handle multiple configurations, ignoring', specificConfigurations.slice(1));
  }
  const key = specificConfigurations.length && specificConfigurations[0];
  const angularCompilerPlugin = config.plugins.find(pl => pl instanceof AngularCompilerPlugin) as AngularCompilerPlugin;

  if (angularCompilerPlugin.options.directTemplateLoading) {
    // deactivate directTemplateLoading so that webpack loads html files
    angularCompilerPlugin.options.directTemplateLoading = false;

    // needed after deactivating directTemplateLoading
    config.module.rules.push({ test: /\.html$/, loader: 'raw-loader' });

    log('deactivated directTemplateLoading');
  }

  // set production mode
  config.plugins.push(
    new webpack.DefinePlugin({
      PWA_VERSION: JSON.stringify(
        `${require('../../package.json').version} built ${new Date()} - production:${production}`
      ),
      PRODUCTION_MODE: production,
    })
  );
  log('setting production:', production);

  if (production) {
    log('setting up data-testing-id removal');

    // remove testing ids when loading html files
    config.module.rules.push({
      test: /\.html$/,
      use: [{ loader: join(__dirname, 'data-testing-id-loader.js') }],
    });
  }

  if (key) {
    log(`setting up dynamic Component template and style replacement for files matching "${key}"`);

    // dynamically replace html templates and component styles depending on configuration
    config.module.rules.push({
      test: /\.component\.(html|scss)$/,
      loader: 'file-replace-loader',
      options: {
        condition: 'if-replacement-exists',
        replacement(resourcePath) {
          return resolve(resourcePath.replace('.component.', `.component.${key}.`));
        },
        async: true,
      },
    });

    const environmentsBase = join(dirname(angularCompilerPlugin.options.mainPath), 'environments');
    const specialEnvironmentFile = join(environmentsBase, `environment.${key}.ts`);

    if (existsSync(specialEnvironmentFile)) {
      log(`setting up environments replacement for "${key}"`);
      angularCompilerPlugin.options.hostReplacementPaths[
        join(environmentsBase, 'environment.ts')
      ] = specialEnvironmentFile;
    }
  }

  return config;
};
