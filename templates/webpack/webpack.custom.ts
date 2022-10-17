import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as fs from 'fs';
import { flattenDeep } from 'lodash';
import { basename, dirname, join, normalize, resolve } from 'path';
import * as ts from 'typescript';
import { Configuration, DefinePlugin, WebpackPluginInstance } from 'webpack';

/* eslint-disable no-console, @typescript-eslint/no-var-requires, @typescript-eslint/naming-convention */

const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const glob = require('glob');

class Logger {
  constructor(private target: string, private config: string, progressActive: boolean) {
    if (progressActive) {
      console.log('\n');
    }
  }

  log(...txt: unknown[]) {
    console.log(`${this.target}@${this.config}:`, ...txt);
  }

  warn(...txt: unknown[]) {
    console.warn(`${this.target}@${this.config}:`, ...txt);
  }
}

let logger: Logger;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function traverse(obj: object, ftest: (value: unknown) => boolean, func: (obj: any, key: string) => void) {
  Object.entries(obj).forEach(([k, v]) => {
    if (ftest(v)) {
      func(obj, k);
    }
  });
  Object.values(obj).forEach(v => {
    if (v && typeof v === 'object') {
      traverse(v, ftest, func);
    }
  });
}

function determineConfiguration(angularJsonConfig: CustomWebpackBrowserSchema, targetOptions: TargetOptions) {
  const angularJson = JSON.parse(fs.readFileSync('angular.json', { encoding: 'utf-8' }));

  // use angular.json 'defaultConfiguration' if no explicit configuration was set
  if (!targetOptions.configuration) {
    targetOptions.configuration =
      angularJson.projects[targetOptions.project].architect[targetOptions.target].defaultConfiguration ||
      'b2b,production';
  }

  if (targetOptions.configuration === 'development' || targetOptions.configuration === 'production') {
    console.error(
      `configuration cannot just be ${targetOptions.configuration}, it has to be used with a theme (--configuration=<theme>,${targetOptions.configuration})`
    );
    process.exit(1);
  }

  const availableThemes = Object.keys(angularJson.projects[angularJson.defaultProject].architect.build.configurations);

  const normalConfigTest = (x: string) => x !== 'development' && x !== 'production';

  const configRegex = `^(${availableThemes.filter(normalConfigTest).join('|')}),(development|production)$`;
  if (!new RegExp(configRegex).test(targetOptions.configuration)) {
    console.error(`requested configuration does not match pattern '${configRegex}'`);
    process.exit(1);
  }

  logger = new Logger(targetOptions.target, targetOptions.configuration, angularJsonConfig.progress);

  const configurations = targetOptions.configuration.split(',');
  const theme = configurations.filter(normalConfigTest)[0];
  const production = !!(configurations.includes('production') || angularJsonConfig.buildOptimizer);

  return {
    theme,
    production,
    availableThemes,
  };
}

/*
 * RULES:
 * - no elvis operators
 * - no instanceof checks
 */
// eslint-disable-next-line complexity
export default (config: Configuration, angularJsonConfig: CustomWebpackBrowserSchema, targetOptions: TargetOptions) => {
  const { theme, production, availableThemes } = determineConfiguration(angularJsonConfig, targetOptions);

  const angularCompilerPlugin = config.plugins.find(
    (pl: AngularPlugin) => pl.options?.directTemplateLoading !== undefined
  ) as AngularPlugin;

  if (angularCompilerPlugin.options.directTemplateLoading) {
    // deactivate directTemplateLoading so that webpack loads html files
    angularCompilerPlugin.options.directTemplateLoading = false;

    logger.log('deactivated directTemplateLoading');
  }

  // set production mode, service-worker, ngrx runtime checks
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
      THEME: JSON.stringify(theme),
      SSR: targetOptions.target === 'server',
    })
  );
  logger.log('setting production:', production);
  logger.log('setting serviceWorker:', serviceWorker);
  logger.log('setting ngrxRuntimeChecks:', ngrxRuntimeChecks);

  if (production) {
    // keep module names for debugging
    config.optimization.minimizer.forEach((m: WebpackPluginInstance) => {
      if (m.options?.terserOptions) {
        m.options.terserOptions.keep_classnames = /.*Module$/;
      }
    });

    // splitChunks not available for SSR build
    if (config.optimization.splitChunks) {
      logger.log('optimizing chunk splitting');

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
          const locale = i18nMatch?.[1];

          if (locale) {
            return locale.replace('_', '-');
          }

          const match = /[\\/](extensions|projects)[\\/](.*?)[\\/](src[\\/]app[\\/])?(.*)/.exec(identifier);
          const feature = match?.[2];

          if (feature) {
            // include core functionality in common bundle
            if (['captcha', 'seo', 'tracking', 'recently'].some(f => f === feature)) {
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
      logger.log('setting up data-testing-id removal');
      // remove testing ids when loading html files
      config.module.rules.push({
        test: /\.html$/,
        use: [{ loader: join(__dirname, 'data-testing-id-loader.js') }],
      });
    }

    logger.log('setting up purgecss CSS minification');
    config.plugins.push(
      new PurgeCSSPlugin({
        paths: glob.sync('./**/src/app/**/!(*.spec.ts)*', { nodir: true }),
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

  crawlFiles(join(process.cwd()), files => {
    const themes = [...availableThemes, 'all'];

    // sanity check preventing to use 'all' with other themes
    files.forEach(f => {
      const used = themes.filter(t => basename(f).includes(`.${t}.`));
      if (used.length > 1 && used.includes('all')) {
        throw new Error(`override for 'all' cannot be used next to other themes:\n  ${f}`);
      }
    });

    // find original files and their possible replacements
    const replacers = files
      // filter for replaceable files
      .filter(f => ['html', 'scss', 'ts'].some(ext => f.endsWith(ext)) && !f.endsWith('.spec.ts'))
      .reduce<Record<string, string[]>>((acc, file) => {
        // deduce original name
        const original = themes.reduce((a, k) => a.replace(`.${k}.`, '.'), file);

        // add possible replacements (current theme or 'all')
        if (original !== file && [`.${theme}`, '.all.'].some(t => file.includes(t))) {
          acc[original] = [...(acc[original] || []), file]
            // sort replacements (theme should be prioritized, 'all' should come last)
            .sort((a, b) => {
              if (a.includes(`'${theme}.`) || b.includes('.all.')) {
                return -1;
              } else if (b.includes(`'${theme}.`) || a.includes('.all.')) {
                return 1;
              }
              return 0;
            });
        }
        return acc;
      }, {});

    const replacements = Object.entries(replacers)
      .map(([original, overrides]) => ({
        replacement: overrides[0],
        original,
      }))
      .filter(replacement => files.includes(replacement.original));

    replacements.forEach(replacement => {
      angularCompilerPlugin.options.fileReplacements[replacement.original] = replacement.replacement;
    });
  });
  const noOfReplacements = Object.keys(angularCompilerPlugin.options.fileReplacements).length;
  logger.log(`using ${noOfReplacements} replacement${noOfReplacements === 1 ? '' : 's'} for "${theme}"`);

  config.module.rules.push({
    test: /\.component\.(html|scss)$/,
    loader: 'file-replace-loader',
    options: {
      condition: 'always',
      replacement(resourcePath: string) {
        return resolve(angularCompilerPlugin.options.fileReplacements[resourcePath] ?? resourcePath);
      },
      async: true,
    },
  });

  ['styles', 'assets'].forEach(folder => {
    const defaultThemePath = join('src', folder, 'themes', 'placeholder');
    const newThemePath = join('src', folder, 'themes', theme);

    traverse(
      config,
      v => typeof v === 'string' && v.includes(defaultThemePath),
      (obj, key) => {
        obj[key] = (obj[key] as string).replace(defaultThemePath, newThemePath);
      }
    );

    const normalDefaultThemePath = defaultThemePath.replace(/\\/g, '/');
    const normalNewThemePath = newThemePath.replace(/\\/g, '/');

    traverse(
      angularJsonConfig,
      v => typeof v === 'string' && v.includes(normalDefaultThemePath),
      (obj, key) => {
        obj[key] = (obj[key] as string).replace(normalDefaultThemePath, normalNewThemePath);
      }
    );
  });

  // set theme specific angular cache directory
  const cacheDir = join('.angular', 'cache');
  traverse(
    config,
    v => typeof v === 'string' && v.includes(cacheDir),
    (obj, key) => {
      obj[key] = (obj[key] as string).replace(cacheDir, join(cacheDir, theme));
    }
  );

  if (angularJsonConfig.tsConfig.endsWith('tsconfig.app-no-checks.json')) {
    logger.warn('using tsconfig without compile checks');
    if (production) {
      logger.warn('USING NO COMPILE CHECKS SHOULD NEVER BE DONE IN PRODUCTION MODE!');
    }
  }

  process.on('exit', () => {
    fs.mkdirSync(config.output.path, { recursive: true });

    const l = process.cwd().length + 1;
    const logOutputFile = (file: string) => file.substring(l).replace(/\\/g, '/');

    // write replacements json with relative parts for script use
    const relativeReplacements = Object.entries(angularCompilerPlugin.options.fileReplacements).reduce<
      Record<string, string>
    >((acc, [k, v]) => ({ ...acc, [k.substring(l).replace(/\\/g, '/')]: v.substring(l).replace(/\\/g, '/') }), {});

    const replacementsPath = join(config.output.path, 'replacements.json');
    logger.log('writing', logOutputFile(replacementsPath));
    fs.writeFileSync(replacementsPath, JSON.stringify(relativeReplacements, undefined, 2));

    const outputFolder = fs.readdirSync(config.output.path);
    const sourceMaps = outputFolder.filter(f => f.endsWith('.js.map'));
    if (sourceMaps.length) {
      const traverseStyleFile = (file: string): string[] => {
        const fileWithExt = file.endsWith('.scss') ? file : `${file}.scss`;
        const path = ['', 'src/styles/', `src/styles/themes/${theme}/`]
          .map(p => normalize(p + fileWithExt))
          .find(fs.existsSync);
        if (!path) {
          return [];
        }

        const paths = [path];

        const regex = /@import '(.*?)'/g;
        const content = fs.readFileSync(path, { encoding: 'utf-8' });
        for (let match: RegExpExecArray; (match = regex.exec(content)); ) {
          paths.push(...traverseStyleFile(match[1]));
        }

        return paths;
      };

      const activeFilesPath = join(config.output.path, 'active-files.json');
      logger.log('writing', logOutputFile(activeFilesPath));

      // write active file report
      const activeFiles = flattenDeep(
        sourceMaps
          .map(sourceMapPath => {
            const sourceMap: { sources: string[] } = JSON.parse(
              fs.readFileSync(join(config.output.path, sourceMapPath), { encoding: 'utf-8' })
            );
            return (
              sourceMap.sources
                // source map entries start with './
                .map(path => path.substring(2))
                .filter(path => path.startsWith('src') || path.startsWith('projects'))
                .filter(path => {
                  // TODO: handle lazy sources whenever this becomes a problem
                  if (path.includes(' lazy ')) {
                    logger.warn('cannot handle lazy source:', path);
                    return false;
                  }
                  return true;
                })
                .map(path => relativeReplacements[path] ?? path)
                .map(path => {
                  if (basename(path).includes('.component.') && path.endsWith('.ts')) {
                    return tsquery(
                      tsquery.ast(fs.readFileSync(path, { encoding: 'utf-8' })),
                      'CallExpression:has(Identifier[name=Component]) PropertyAssignment:has(Identifier[name=styleUrls]) ArrayLiteralExpression > StringLiteral'
                    )
                      .map((styleUrl: ts.StringLiteral) => `${dirname(path)}/${styleUrl.text.substring(2)}`)
                      .map(path => relativeReplacements[path] ?? path)
                      .map(traverseStyleFile)
                      .concat([path]);
                  } else {
                    return path;
                  }
                })
            );
          })
          .concat(traverseStyleFile(`src/styles/themes/${theme}/style`))
      )
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      fs.writeFileSync(activeFilesPath, JSON.stringify(activeFiles, undefined, 2));
    }

    if (process.env.npm_config_dry_run) {
      const effectiveConfigPath = join(config.output.path, 'effective.config.json');
      logger.log('writing', logOutputFile(effectiveConfigPath));
      fs.writeFileSync(effectiveConfigPath, JSON.stringify(config, undefined, 2));

      Object.entries(angularCompilerPlugin.options.fileReplacements).map(([original, replacement]) => {
        angularJsonConfig.fileReplacements.push({
          replace: original,
          with: replacement,
        });
      });

      const effectiveAngularPath = join(config.output.path, 'effective.angular.json');
      logger.log('writing', logOutputFile(effectiveAngularPath));
      fs.writeFileSync(effectiveAngularPath, JSON.stringify(angularJsonConfig, undefined, 2));
    }
  });

  // do not execute the build if npm was started with --dry-run
  // useful for debugging config and reusing replacement logic in other places
  if (process.env.npm_config_dry_run) {
    logger.warn('got --dry-run -- EXITING!');
    process.exit(0);
  }

  return config;
};
