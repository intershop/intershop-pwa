import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import { existsSync } from 'fs';
import * as glob from 'glob';
import { join, resolve } from 'path';
import * as webpack from 'webpack';

const purgecssPlugin = require('purgecss-webpack-plugin');

const log = (...txt) => {
  // tslint:disable-next-line: no-console
  console.log('Custom Webpack:', ...txt);
};

type AngularPlugin = webpack.Plugin & {
  options: {
    directTemplateLoading: boolean;
    fileReplacements: { [source: string]: string };
  };
};

/*
 * RULES:
 * - no elvis operators
 * - no instanceof checks
 */
export default (
  config: webpack.Configuration,
  angularJsonConfig: CustomWebpackBrowserSchema,
  targetOptions: TargetOptions
) => {
  const configurations = targetOptions.configuration.split(',');
  const specificConfigurations = configurations.filter(x => x !== 'production');
  if (specificConfigurations.length > 1) {
    console.warn('cannot handle multiple configurations, ignoring', specificConfigurations.slice(1));
  }
  const key = specificConfigurations.length && specificConfigurations[0];

  const angularCompilerPlugin = config.plugins.find(
    (pl: AngularPlugin) => pl.options && pl.options.directTemplateLoading !== undefined
  ) as AngularPlugin;

  if (angularCompilerPlugin.options.directTemplateLoading) {
    // deactivate directTemplateLoading so that webpack loads html files
    angularCompilerPlugin.options.directTemplateLoading = false;

    // needed after deactivating directTemplateLoading
    config.module.rules.push({ test: /\.html$/, loader: 'raw-loader' });

    log('deactivated directTemplateLoading');
  }

  // set production mode and service-worker
  const production = configurations.includes('production');
  const serviceWorker = !!angularJsonConfig.serviceWorker;
  config.plugins.push(
    new webpack.DefinePlugin({
      PWA_VERSION: JSON.stringify(
        `${require('../../package.json').version} built ${new Date()} - configuration:${
          targetOptions.configuration
        } service-worker:${serviceWorker}`
      ),
      PRODUCTION_MODE: production,
      SERVICE_WORKER: serviceWorker,
    })
  );
  log('setting production:', production);
  log('setting serviceWorker:', serviceWorker);

  if (production) {
    // splitChunks not available for SSR build
    if (config.optimization.splitChunks) {
      log('optimizing chunk splitting');

      const cacheGroups = config.optimization.splitChunks.cacheGroups as {
        [key: string]: webpack.Options.CacheGroupsOptions;
      };

      // chunk for all core functionality the user usually doesn't use while just browsing the shop
      cacheGroups.customer = {
        minChunks: 1,
        priority: 30,
        // add [\\/]src[\\/]app at the beginning of this regex to only include
        // my-account pages from the PWA core
        test: /[\\/]pages[\\/](account|checkout|registration|contact|forgot-password)/,
        chunks: 'async',
        name: 'customer',
      };

      // individual bundles for extensions and projects, that should only be loaded when necessary
      cacheGroups.features = {
        minChunks: 1,
        priority: 25,
        chunks: 'async',
        name(module) {
          const identifier = module.identifier();

          // embed sentry library in sentry chunk
          if (identifier.includes('@sentry')) {
            return 'sentry';
          }
          // keep exports and routing modules in common
          if (identifier.includes('routing') || identifier.includes('exports')) {
            return 'common';
          }

          const match = /[\\/](extensions|projects)[\\/](.*?)[\\/]/.exec(identifier);
          const feature = match && match[2];

          // include captcha functionality in common bundle
          if (feature === 'captcha') {
            return 'common';
          }
          return feature || 'common';
        },
      };

      // overriding settings for the common bundle which contains:
      // - all lazy-loadable core functionality
      // - libraries that can be lazy loaded
      cacheGroups.common.minChunks = 1;
      cacheGroups.common.priority = 20;
    }

    log('setting up data-testing-id removal');
    // remove testing ids when loading html files
    config.module.rules.push({
      test: /\.html$/,
      use: [{ loader: join(__dirname, 'data-testing-id-loader.js') }],
    });

    log('setting up purgecss CSS minification');
    config.plugins.push(
      new purgecssPlugin({
        paths: glob.sync('./{src,projects}/**/*', { nodir: true }),
        safelist: {
          standard: [/(p|m)(l|r|x|y|t|b)?-[0-5]/],
          greedy: [/\bfa\b/, /\bmodal\b/, /\bswiper\b/, /\bcarousel\b/, /\bslide\b/],
        },
      })
    );
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

    const environmentsBase = join(process.cwd(), 'src', 'environments');
    const specialEnvironmentFile = join(environmentsBase, `environment.${key}.ts`);

    if (existsSync(specialEnvironmentFile)) {
      log(`setting up environments replacement for "${key}"`);
      angularCompilerPlugin.options.fileReplacements[join(environmentsBase, 'environment.ts')] = specialEnvironmentFile;
    }
  }

  return config;
};
