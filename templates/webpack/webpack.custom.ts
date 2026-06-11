import { CustomWebpackBrowserSchema, TargetOptions } from '@angular-builders/custom-webpack';
import { tsquery } from '@phenomnomnominal/tsquery';
import * as fs from 'fs';
import { flattenDeep } from 'lodash';
import { basename, dirname, join, normalize, resolve } from 'path';
import * as ts from 'typescript';
import { Compiler, Configuration, DefinePlugin, WebpackPluginInstance } from 'webpack';

import {
  buildResourceReplacements,
  resolveThemeBuildContext,
  resolveThemeFileReplacements,
  toRelativeReplacements,
  writeReplacementsJson,
} from '../../scripts/build/theme-resolver';

/* eslint-disable no-console, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention */

const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const { globSync } = require('glob');

class Logger {
  constructor(
    private target: string,
    private config: string,
    progressActive: boolean
  ) {
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

type AngularPlugin = {
  options: {
    directTemplateLoading: boolean;
    fileReplacements: Record<string, string>;
  };
} & WebpackPluginInstance;

/*
 * RULES:
 * - no elvis operators
 * - no instanceof checks
 */
// eslint-disable-next-line complexity
export default (config: Configuration, angularJsonConfig: CustomWebpackBrowserSchema, targetOptions: TargetOptions) => {
  const { theme, production, availableThemes, configuration } = resolveThemeBuildContext(
    angularJsonConfig,
    targetOptions
  );
  targetOptions.configuration = configuration;
  logger = new Logger(targetOptions.target, configuration, angularJsonConfig.progress);

  // apply babel-loader to undici node module
  const path = require('path');
  let undiciDir;
  try {
    undiciDir = path.dirname(require.resolve('undici/package.json'));
  } catch (e) {
    logger.warn('Could not resolve undici package for babel-loader include:', e);
    undiciDir = undefined;
  }
  if (undiciDir && targetOptions.target === 'server') {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.unshift({
      test: /\.js$/,
      include: undiciDir,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    });
    logger.log('Added babel-loader for undici module:', undiciDir);
  }

  const angularCompilerPlugin = config.plugins.find(
    (pl: AngularPlugin) => pl.options?.directTemplateLoading !== undefined
  ) as AngularPlugin;

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

  // suppress webpack warning for optional elastic-apm-node (Elastic APM - Application Performance Monitoring) dependency in @elastic/ecs-pino-format
  if (targetOptions.target === 'server') {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    (config.resolve.alias as Record<string, false | string>)['elastic-apm-node'] = false;
  }

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

      // split heavy third-party libs into async chunks to reduce common/vendor bundle size
      cacheGroups['lib-swiper'] = {
        test: /[\\/]node_modules[\\/]swiper[\\/]/,
        chunks: 'all',
        name: 'lib-swiper',
        priority: 60,
        enforce: true,
      };
      cacheGroups['lib-cdk'] = {
        test: /[\\/]node_modules[\\/]@angular[\\/]cdk[\\/]/,
        chunks: 'async',
        name: 'lib-cdk',
        priority: 50,
        enforce: true,
      };
      cacheGroups['lib-extras'] = {
        test: /[\\/]node_modules[\\/](@ngx-formly|ng-recaptcha|date-fns|ngx-infinite-scroll)[\\/]/,
        chunks: 'async',
        name: 'lib-extras',
        priority: 40,
        enforce: true,
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
        paths: globSync('./**/src/app/**/!(*.spec.ts)*', { nodir: true }),
        safelist: {
          standard: [/(?:((m|p)(t|b|s|e|x|y)?(-(sm|md|lg|xl))?-([0-5]|auto))|((w|h)-(25|50|75|100|auto)))/],
          greedy: [
            /\bmodal\b/,
            /\bdrop/,
            /\bswiper\b/,
            /\bcarousel\b/,
            /\bslide\b/,
            /\bnav-tabs\b/,
            /\bnav-link\b/,
            /\bpopover\b/,
            /\btable\b/,
            /\bng-select\b/,
            /\btoast\b/,
            /\btext-\b/,
          ],
        },
      })
    );
  }

  angularCompilerPlugin.options.fileReplacements = {
    ...angularCompilerPlugin.options.fileReplacements,
    ...resolveThemeFileReplacements(theme, availableThemes),
  };
  const noOfReplacements = Object.keys(angularCompilerPlugin.options.fileReplacements).length;
  logger.log(`using ${noOfReplacements} replacement${noOfReplacements === 1 ? '' : 's'} for "${theme}"`);

  /* Angular 19+: The Angular compiler reads templates/styles via webpack's inputFileSystem (createWebpackSystem),
     bypassing ts.sys.readFile entirely. Since fileReplacements only handles .ts module resolution, we wrap
     inputFileSystem.readFileSync to redirect template/style reads to their theme-specific overrides. */
  const resourceReplacements = buildResourceReplacements(angularCompilerPlugin.options.fileReplacements);

  if (Object.keys(resourceReplacements).length) {
    config.plugins.push({
      apply(compiler: Compiler) {
        compiler.hooks.afterEnvironment.tap('ThemeFileReplacementPlugin', () => {
          const inputFS = compiler.inputFileSystem;
          const origReadFileSync = inputFS.readFileSync.bind(inputFS);
          inputFS.readFileSync = function (filePath: string) {
            const replacement = htmlReplacements[normalize(filePath)];
            return origReadFileSync(replacement ?? filePath);
          } as typeof inputFS.readFileSync;
        });

        // Watch HTML replacement files so changes trigger recompilation
        compiler.hooks.afterCompile.tap('ThemeFileReplacementPlugin', compilation => {
          for (const replacement of Object.values(htmlReplacements)) {
            compilation.fileDependencies.add(replacement);
          }
        });
      },
    });
  }

  // SCSS: Use file-replace-loader to swap component styles at load time.
  // SCSS files go through webpack's loader pipeline, so this works reliably with watch mode.
  config.module.rules.push({
    test: /\.component\.scss$/,
    loader: 'file-replace-loader',
    options: {
      condition: 'always',
      replacement(resourcePath: string) {
        return resolve(angularCompilerPlugin.options.fileReplacements[resourcePath] ?? resourcePath);
      },
      async: true,
    },
  });

  const themePlaceholder = 'theme_placeholder';

  traverse(
    config,
    v => typeof v === 'string' && v.includes(themePlaceholder),
    (obj, key) => {
      obj[key] = (obj[key] as string).replace(themePlaceholder, theme);
    }
  );

  traverse(
    angularJsonConfig,
    v => typeof v === 'string' && v.includes(themePlaceholder),
    (obj, key) => {
      obj[key] = (obj[key] as string).replace(themePlaceholder, theme);
    }
  );

  // set theme specific angular cache directory
  const cacheDir = join('.angular', 'cache');
  traverse(
    config,
    v => typeof v === 'string' && v.includes(cacheDir),
    (obj, key) => {
      obj[key] = (obj[key] as string).replace(cacheDir, join(cacheDir, theme));
    }
  );

  // silence Sass @import deprecation warnings (cannot migrate to @use while Bootstrap uses @import)
  const patchSassLoader = (rules: unknown[]) => {
    for (const rule of rules) {
      if (!rule || typeof rule !== 'object') {
        continue;
      }
      const r = rule as Record<string, unknown>;
      if (Array.isArray(r.rules)) {
        patchSassLoader(r.rules);
      }
      if (Array.isArray(r.use)) {
        for (const entry of r.use) {
          if (entry && typeof entry === 'object' && 'loader' in entry) {
            const loaderEntry = entry as { loader: string; options?: { sassOptions?(...args: unknown[]): object } };
            if (typeof loaderEntry.loader === 'string' && loaderEntry.loader.includes('sass-loader')) {
              const origFn = loaderEntry.options?.sassOptions;
              if (typeof origFn === 'function') {
                loaderEntry.options.sassOptions = ctx => ({
                  ...origFn(ctx),
                  silenceDeprecations: ['import'],
                });
              }
            }
          }
        }
      }
    }
  };
  if (config.module?.rules) {
    patchSassLoader(config.module.rules);
  }

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

    const relativeReplacements = toRelativeReplacements(angularCompilerPlugin.options.fileReplacements);
    const replacementsPath = writeReplacementsJson(config.output.path, angularCompilerPlugin.options.fileReplacements);
    logger.log('writing', logOutputFile(replacementsPath));

    const outputFolder = fs.readdirSync(config.output.path);
    const sourceMaps = outputFolder.filter(f => f.endsWith('.js.map'));
    if (sourceMaps.length) {
      const traverseStyleFile = (file: string): string[] => {
        const fileWithExt = file.endsWith('.scss') ? file : `${file}.scss`;
        const scssPath = ['', 'src/styles/', `src/styles/themes/${theme}/`]
          .map(p => normalize(p + fileWithExt))
          .find(fs.existsSync);
        if (!scssPath) {
          return [];
        }

        const paths = [scssPath];

        const regex = /@import '(.*?)'/g;
        const content = fs.readFileSync(scssPath, { encoding: 'utf-8' });
        for (let match: RegExpExecArray; (match = regex.exec(content));) {
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
                .map(sourcePath => sourcePath.substring(2))
                .filter(sourcePath => sourcePath.startsWith('src') || sourcePath.startsWith('projects'))
                .filter(sourcePath => {
                  // TODO: handle lazy sources whenever this becomes a problem
                  if (sourcePath.includes(' lazy ')) {
                    logger.warn('cannot handle lazy source:', sourcePath);
                    return false;
                  }
                  return true;
                })
                .map(sourcePath => relativeReplacements[sourcePath] ?? sourcePath)
                .map(sourcePath => {
                  if (basename(sourcePath).includes('.component.') && sourcePath.endsWith('.ts')) {
                    return tsquery(
                      tsquery.ast(fs.readFileSync(sourcePath, { encoding: 'utf-8' })),
                      'CallExpression:has(Identifier[name=Component]) PropertyAssignment:has(Identifier[name=styleUrls]) ArrayLiteralExpression > StringLiteral'
                    )
                      .map((styleUrl: ts.StringLiteral) => `${dirname(sourcePath)}/${styleUrl.text.substring(2)}`)
                      .map(stylePath => relativeReplacements[stylePath] ?? stylePath)
                      .map(traverseStyleFile)
                      .concat([sourcePath]);
                  } else {
                    return sourcePath;
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
