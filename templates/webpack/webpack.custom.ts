import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import * as fs from 'fs';
import * as glob from 'glob';
import { join, sep } from 'path';
import { Configuration, DefinePlugin, WebpackPluginInstance } from 'webpack';

const purgecssPlugin = require('purgecss-webpack-plugin');

const log = (...txt: unknown[]) => {
  // tslint:disable-next-line: no-console
  console.log('Custom Webpack:', ...txt);
};

const warn = (...txt: unknown[]) => {
  // tslint:disable-next-line: no-console
  console.warn('Custom Webpack:', ...txt);
};

type AngularPlugin = WebpackPluginInstance & {
  options: {
    directTemplateLoading: boolean;
    fileReplacements: { [source: string]: string };
  };
};

function crawlFiles(folder: string, callback: (files: string[]) => void) {
  if (fs.statSync(folder).isDirectory() && !['node_modules', '.git'].some(baseName => folder.endsWith(baseName))) {
    const content = fs.readdirSync(folder).map(file => join(folder, file));

    const files = content.filter(f => fs.statSync(f).isFile());
    if (files.length) {
      callback(files);
    }

    content.filter(f => fs.statSync(f).isDirectory()).forEach(d => crawlFiles(d, callback));
  }
}

// tslint:disable-next-line: no-any
function traverse(obj: object, test: (value: unknown) => boolean, func: (obj: any, key: string) => void) {
  Object.entries(obj).forEach(([k, v]) => {
    if (test(v)) {
      func(obj, k);
    }
  });
  Object.values(obj).forEach(v => {
    if (v && typeof v === 'object') {
      traverse(v, test, func);
    }
  });
}

/*
 * RULES:
 * - no elvis operators
 * - no instanceof checks
 */
export default (config: Configuration, angularJsonConfig: CustomWebpackBrowserSchema, targetOptions: TargetOptions) => {
  const angularJson = JSON.parse(fs.readFileSync('angular.json', { encoding: 'utf-8' }));

  // use angular.json 'defaultConfiguration' if no explicit configuration was set
  if (!targetOptions.configuration) {
    targetOptions.configuration =
      angularJson.projects[targetOptions.project].architect[targetOptions.target].defaultConfiguration ||
      'default,production';
  }

  if (targetOptions.configuration === 'local' || targetOptions.configuration === 'production') {
    console.error(
      `configuration cannot just be ${targetOptions.configuration}, it has to be used with a theme (--configuration=<theme>,${targetOptions.configuration})`
    );
    process.exit(1);
  }

  const availableConfigurations = Object.keys(
    angularJson.projects[angularJson.defaultProject].architect.build.configurations
  );

  const normalConfigTest = (x: string) => x !== 'local' && x !== 'production';

  const configRegex = `^(${availableConfigurations.filter(normalConfigTest).join('|')}),(local|production)$`;
  if (!new RegExp(configRegex).test(targetOptions.configuration)) {
    console.error(`requested configuration does not match pattern '${configRegex}'`);
    process.exit(1);
  }

  // tslint:disable-next-line: no-console
  console.log('\n');
  log('using configuration:', targetOptions.configuration);

  const configurations = targetOptions.configuration.split(',');
  const firstConfiguration = configurations.filter(normalConfigTest)[0];

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

  // set production mode, service-worker, ngrx runtime checks
  const production = !!(configurations.includes('production') || angularJsonConfig.buildOptimizer);
  const serviceWorker = !!angularJsonConfig.serviceWorker;
  const ngrxRuntimeChecks = !!process.env.TESTING || !production;
  config.plugins.push(
    new DefinePlugin({
      PWA_VERSION: JSON.stringify(
        `${require('../../package.json').version} built ${new Date()} - configuration:${
          targetOptions.configuration
        } service-worker:${serviceWorker}`
      ),
      PRODUCTION_MODE: production,
      SERVICE_WORKER: serviceWorker,
      NGRX_RUNTIME_CHECKS: ngrxRuntimeChecks,
    })
  );
  log('setting production:', production);
  log('setting serviceWorker:', serviceWorker);
  log('setting ngrxRuntimeChecks:', ngrxRuntimeChecks);

  if (production) {
    // keep module names for debugging
    config.optimization.minimizer.forEach((m: WebpackPluginInstance) => {
      if (m.options && m.options.terserOptions) {
        m.options.terserOptions.keep_classnames = /.*Module$/;
      }
    });

    // set chunk file names with name instead of id
    config.output.chunkFilename = '[name].[chunkhash:20].js';

    // splitChunks not available for SSR build
    if (config.optimization.splitChunks) {
      log('optimizing chunk splitting');

      const cacheGroups = config.optimization.splitChunks.cacheGroups;

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
        name(module: { identifier(): string }) {
          const identifier = module.identifier() as string;

          // embed sentry library in sentry chunk
          if (/[\\/]node_modules[\\/]@sentry[\\/]/.test(identifier)) {
            return 'sentry';
          }

          // move translation files into own bundles
          const i18nMatch = /[\\/]assets[\\/]i18n[\\/](.*?)\.json/.exec(identifier);
          const locale = i18nMatch && i18nMatch[1];

          if (locale) {
            return locale.replace('_', '-');
          }

          const match = /[\\/](extensions|projects)[\\/](.*?)[\\/](src[\\/]app[\\/])?(.*)/.exec(identifier);
          const feature = match && match[2];

          if (feature) {
            // include core functionality in common bundle
            if (['captcha', 'seo', 'tracking'].some(f => f === feature)) {
              return 'common';
            }

            const effectivePath = match[4];

            // send exports and routing modules to the common module
            if (effectivePath.startsWith('exports') || effectivePath.endsWith('-routing.module.ts')) {
              return 'common';
            }

            return feature;
          }

          return 'common';
        },
      };
    }

    if (!process.env.TESTING) {
      log('setting up data-testing-id removal');
      // remove testing ids when loading html files
      config.module.rules.push({
        test: /\.html$/,
        use: [{ loader: join(__dirname, 'data-testing-id-loader.js') }],
      });
    }

    log('setting up purgecss CSS minification');
    config.plugins.push(
      new purgecssPlugin({
        paths: glob.sync('./{src,projects}/**/*', { nodir: true }),
        safelist: {
          standard: [/(p|m)(l|r|x|y|t|b)?-[0-5]/],
          greedy: [
            /\bfa\b/,
            /\bmodal\b/,
            /\bdrop/,
            /\bswiper\b/,
            /\bcarousel\b/,
            /\bslide\b/,
            /\btoast-close-button\b/,
            /\bnav-tabs\b/,
            /\bnav-link\b/,
            /\bpopover\b/,
            /\btable\b/,
          ],
        },
      })
    );
  }

  log(`setting up replacements for "${firstConfiguration}"`);

  crawlFiles(join(process.cwd()), files => {
    const replacements = files
      .filter(f => f.includes(`.${firstConfiguration}.`) && !f.endsWith('.spec.ts'))
      .map(replacement => ({
        replacement,
        original: availableConfigurations.reduce((acc, k) => acc.replace(`.${k}.`, '.'), replacement),
      }))
      .filter(replacement => files.includes(replacement.original));

    replacements.forEach(replacement => {
      angularCompilerPlugin.options.fileReplacements[replacement.original] = replacement.replacement;
      warn('using', replacement.replacement.replace(process.cwd() + sep, ''));
    });
  });

  if (firstConfiguration !== 'default') {
    const defaultThemePath = join('src', 'styles', 'themes', 'default');
    const newThemePath = join('src', 'styles', 'themes', firstConfiguration);

    traverse(
      config,
      v => typeof v === 'string' && v.includes(defaultThemePath),
      (obj, key) => {
        obj[key] = (obj[key] as string).replace(defaultThemePath, newThemePath);
      }
    );
  }

  if (angularJsonConfig.tsConfig.endsWith('tsconfig.app-no-checks.json')) {
    warn('using tsconfig without compile checks');
    if (production) {
      warn('USING NO COMPILE CHECKS SHOULD NEVER BE DONE IN PRODUCTION MODE!');
    }
  }

  // tslint:disable-next-line: no-commented-out-code
  // fs.writeFileSync('effective.config.json', JSON.stringify(config, undefined, 2), { encoding: 'utf-8' });

  return config;
};
