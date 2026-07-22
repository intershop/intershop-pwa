/* eslint-disable @typescript-eslint/no-require-imports, max-lines */
import { CommonEngine } from '@angular/ssr/node';
import { randomUUID } from 'crypto';
import express from 'express';
import proxy from 'express-http-proxy';
import robots from 'express-robots-txt';
import * as fs from 'fs';
import { join } from 'path';
import * as client from 'prom-client';
import { getGlobalDispatcher, install, interceptors, setGlobalDispatcher } from 'undici';
import { writeHeapSnapshot } from 'v8';
import 'zone.js/node';

import { METRICS_DETAIL_LEVEL } from 'ish-core/configurations/injection-keys';
import { MetricsDetailLevel } from 'ish-core/models/metrics/metrics-detail-level';
import { getLogger } from 'ish-core/utils/ssr-logging/ssr-logging.service';
import { REQUEST, REQUEST_ID, RESPONSE } from 'ish-core/utils/ssr/ssr.tokens';

import { icmCallsCache } from './src/app/core/interceptors/ssr-cache.interceptor';
import {
  APP_BASE_HREF,
  AppServerModule,
  HYBRID_MAPPING_TABLE,
  ICM_CONFIG_MATCH,
  ICM_WEB_URL,
  environment,
} from './src/main.server';
import { getDeployURLFromEnv, setDeployUrlInFile } from './src/ssr/deploy-url';

const logger = getLogger('Server');

function getRequestId(req: express.Request): string {
  return (req as unknown as { requestId: string }).requestId;
}

function getBaseLogData(req: express.Request) {
  return {
    trace: { id: getRequestId(req) },
    url: {
      original: req.originalUrl,
      path: req.path,
      domain: req.get('host'),
    },
  };
}

process.on('SIGUSR2', () => {
  const pm2Name = process.env.name || 'no-pm2';
  const filename = `/tmp/Heap.${pm2Name}.${process.pid}.${new Date().toISOString().replaceAll(':', '-')}.heapsnapshot`;
  writeHeapSnapshot(filename);
  logger.info({ file: { path: filename } }, 'Heap snapshot written');
});

// allowing HTTP/2 uses HTTPClient withFetch() and undici 8 agent, allowH2 option defaults to true
if (/on|1|true|yes/.test((process.env.ALLOW_H2 ?? '').toLowerCase())) {
  install();

  const { dns, retry } = interceptors;

  setGlobalDispatcher(getGlobalDispatcher().compose(dns(), retry()));

  logger.info('Installed undici globally, enabled HTTP/2 support for backend requests');
}

const collectDefaultMetrics = client.collectDefaultMetrics;

const metricsDetailLevel =
  MetricsDetailLevel[process.env.METRICS_DETAIL_LEVEL as keyof typeof MetricsDetailLevel] ?? MetricsDetailLevel.DEFAULT;

const collectDetailedMetrics = metricsDetailLevel === MetricsDetailLevel.DETAILED;

const defaultLabels =
  process.env.pm_id && process.env.name && collectDetailedMetrics
    ? { theme: process.env.name, pm2_id: process.env.pm_id }
    : undefined;

if (defaultLabels) {
  client.register.setDefaultLabels(defaultLabels);
}

const requestCounts = collectDetailedMetrics
  ? new client.Gauge({
      name: 'pwa_http_request_counts',
      help: 'counter for requests labeled with: method, status_code, theme, base_href, path',
      labelNames: ['method', 'status_code', 'base_href', 'path'],
    })
  : undefined;

const basicRequestCounts = collectDetailedMetrics
  ? undefined
  : new client.Counter({
      name: 'pwa_http_request_counts',
      help: 'counter for requests labeled with: method, status_code',
      labelNames: ['method', 'status_code'],
    });

const requestDuration = collectDetailedMetrics
  ? new client.Histogram({
      name: 'pwa_http_request_duration_seconds',
      help: 'duration histogram of http responses labeled with: status_code, theme',
      buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30],
      labelNames: ['status_code', 'base_href', 'path'],
    })
  : undefined;

const basicRequestDuration = collectDetailedMetrics
  ? undefined
  : new client.Histogram({
      name: 'pwa_http_request_duration_seconds',
      help: 'duration histogram of http responses labeled with: status_code',
      buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30],
      labelNames: ['status_code'],
    });

const restRequestDuration = collectDetailedMetrics
  ? new client.Summary({
      name: 'pwa_rest_request_duration_seconds',
      help: 'duration histogram of ICM rest responses',
      percentiles: [0.5, 0.9, 0.95, 0.99],
      labelNames: ['endpoint'],
    })
  : undefined;

const PORT = process.env.PORT || 4200;

const DEPLOY_URL = getDeployURLFromEnv();

const DIST_FOLDER = join(process.cwd(), 'dist');

const BROWSER_FOLDER = process.env.BROWSER_FOLDER || join(process.cwd(), 'dist', 'browser');

// The Express app is exported so that it can be used by serverless Functions.
// eslint-disable-next-line complexity
export function app() {
  const ICM_BASE_URL = process.env.ICM_BASE_URL || environment.icmBaseURL;

  const SSR_HYBRID_BACKEND = process.env.SSR_HYBRID_BACKEND || ICM_BASE_URL;

  if (!ICM_BASE_URL) {
    logger.fatal('ICM_BASE_URL not set');
    process.exit(1);
  }

  if (process.env.TRUST_ICM) {
    // trust https certificate if self-signed
    // see also https://medium.com/nodejs-tips/ssl-certificate-explained-fc86f8aa43d4
    // and https://github.com/angular/universal/issues/856#issuecomment-436364729
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    logger.warn("Ignoring all TLS verification as 'TRUST_ICM' variable is set - never use this in production!");
  } else {
    const [icmProtocol, icmBase] = ICM_BASE_URL.split('://');
    // check for ssl certificate should be done, if https is used
    if (icmProtocol === 'https') {
      const https = require('https');

      const [, icmHost, icmPort] = /^(.*?):?([0-9]+)?[/]*$/.exec(icmBase);

      const options = {
        host: icmHost,
        port: icmPort || '443',
        method: 'get',
        path: '/',
      };

      const req = https.request(options, (res: { socket: { authorized: boolean } }) => {
        logger.info(
          {
            url: { original: ICM_BASE_URL },
            tls: { established: res.socket.authorized },
          },
          'Certificate authorization check'
        );
      });

      const certErrorCodes = [
        'CERT_CHAIN_TOO_LONG',
        'CERT_HAS_EXPIRED',
        'CERT_NOT_YET_VALID',
        'CERT_REJECTED',
        'CERT_REVOKED',
        'CERT_SIGNATURE_FAILURE',
        'CERT_UNTRUSTED',
        'DEPTH_ZERO_SELF_SIGNED_CERT',
        'ERROR_IN_CERT_NOT_AFTER_FIELD',
        'ERROR_IN_CERT_NOT_BEFORE_FIELD',
        'HOSTNAME_MISMATCH',
        'INVALID_CA',
        'INVALID_PURPOSE',
        'SELF_SIGNED_CERT_IN_CHAIN',
        'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
        'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
      ];

      req.on('error', (e: { code: string }) => {
        if (certErrorCodes.includes(e.code)) {
          logger.warn(
            {
              error: { code: e.code },
              url: { original: ICM_BASE_URL },
              labels: {
                suggestion:
                  "Please set 'TRUST_ICM' variable to avoid further errors for all requests to the ICM_BASE_URL - never use this in production!",
              },
            },
            'The given ICM_BASE_URL has a certificate problem.'
          );
        } else {
          logger.error({ error: { message: String(e), code: e.code } }, 'Request error');
        }
      });

      req.end();
    }
  }

  // Express server
  const server = express();

  // Request tracing
  server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Use existing X-Request-ID from NGINX if present, otherwise generate new
    const requestId = req.get('X-Request-ID') || randomUUID();
    (req as unknown as { requestId: string }).requestId = requestId;
    // Return request ID in response header for debugging
    res.set('X-Request-ID', requestId);
    next();
  });

  const prometheusRest: { endpoint: string; duration: number }[] = [];

  // setup Angular SSR engine
  const commonEngine = new CommonEngine({
    bootstrap: AppServerModule,
    providers: [
      { provide: 'SSR_HYBRID', useValue: !!process.env.SSR_HYBRID },
      { provide: 'PROMETHEUS_REST', useValue: prometheusRest },
      { provide: METRICS_DETAIL_LEVEL, useValue: metricsDetailLevel },
    ],
    allowedHosts: ['localhost', ...(process.env.ALLOWED_HOSTS?.split(',') ?? [])],
  });

  const onFinished = require('on-finished');

  server.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Skip logging for static ICM resources
    if (req.originalUrl.startsWith('/INTERSHOP/static')) {
      return next();
    }

    const start = Date.now();

    onFinished(res, () => {
      const duration = Date.now() - start;
      const rawContentLength = res.getHeader('content-length');
      const contentLength = rawContentLength !== undefined ? Number(rawContentLength) : undefined;

      const logData = {
        ...getBaseLogData(req),
        http: {
          request: { method: req.method },
          response: {
            status_code: res.statusCode,
            ...(Number.isFinite(contentLength) && { body: { bytes: contentLength } }),
          },
        },
        event: { duration: duration * 1_000_000 }, // Convert ms to nanoseconds
      };

      if (res.statusCode >= 500) {
        logger.error(logData, req.method);
      } else if (res.statusCode >= 400) {
        logger.warn(logData, req.method);
      } else {
        logger.info(logData, req.method);
      }
    });

    next();
  });

  // seo robots.txt
  const pathToRobotsTxt = join(DIST_FOLDER, 'robots.txt');
  if (fs.existsSync(pathToRobotsTxt)) {
    server.use(robots(pathToRobotsTxt));
  } else {
    server.use(
      robots({
        UserAgent: '*',
        Disallow: [
          '/error',
          '/maintenance',
          '/account',
          '/compare',
          '/recently',
          '/basket',
          '/checkout',
          '/register',
          '/login',
          '/logout',
          '/forgotPassword',
          '/gdpr-requests',
          '/contact',
        ],
      })
    );
  }

  const hybridRedirect = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const url = req.originalUrl;
    let newUrl: string;
    for (const entry of HYBRID_MAPPING_TABLE) {
      const icmUrlRegex = new RegExp(entry.icm);
      const pwaUrlRegex = new RegExp(entry.pwa);
      const icmMatchArray = icmUrlRegex.exec(url);
      if (icmMatchArray && entry.handledBy === 'pwa') {
        const config: Record<string, string> = {
          ...icmMatchArray.groups,
          application: environment.icmApplication || '-',
        };
        newUrl = url
          // Rewrite configuration part of incoming ICM url
          .replace(new RegExp(ICM_CONFIG_MATCH), buildICMWebURL(config))
          // Build pwa URL based on equally named-groups of ICM url
          .replace(icmUrlRegex, `/${entry.pwaBuild}`);
        break;
      } else if (pwaUrlRegex.exec(url) && entry.handledBy === 'icm') {
        const config: Record<string, string> = {};
        if (/;lang=[\w_]+/.test(url)) {
          const [, lang] = /;lang=([\w_]+)/.exec(url);
          config.lang = lang;
        }
        if (!config.lang) {
          config.lang = environment.defaultLocale;
        }

        if (/;currency=[\w_]+/.test(url)) {
          const [, currency] = /;currency=([\w_]+)/.exec(url);
          config.currency = currency;
        }

        if (/;channel=[^;]*/.test(url)) {
          config.channel = /;channel=([^;]*)/.exec(url)[1];
        } else {
          config.channel = environment.icmChannel;
        }

        config.application = environment.hybridApplication || environment.icmApplication;

        const build = [buildICMWebURL(config), entry.icmBuild].join('/');
        newUrl = url.replace(pwaUrlRegex, build).replace(/;.*/g, '');
        break;
      }
    }
    if (newUrl) {
      logger.info({ url: { original: url, full: newUrl } }, 'RED (Hybrid redirect)');
      res.redirect(301, newUrl);
    } else {
      next();
    }
  };

  const buildICMWebURL = (config: Record<string, string> = {}): string =>
    ICM_WEB_URL.replace(/\$<(\w+)>/g, (match, group) => config[group] || match);

  if (process.env.SSR_HYBRID) {
    server.use(/.*/, hybridRedirect);
  }

  const icmProxy = proxy(SSR_HYBRID_BACKEND, {
    // preserve original path
    proxyReqPathResolver: req => req.originalUrl,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    proxyReqOptDecorator: (options: any) => {
      if (process.env.TRUST_ICM) {
        // https://github.com/villadora/express-http-proxy#q-how-to-ignore-self-signed-certificates-
        options.rejectUnauthorized = false;
      }
      if (process.env.SSR_HYBRID) {
        // Force context proto to be https otherwise ICM WA is redirecting us to https
        options.headers['X-Forwarded-Proto'] = 'https';
      }
      return options;
    },
    // fool ICM so it thinks it's running here
    // https://www.npmjs.com/package/express-http-proxy#preservehosthdr
    preserveHostHdr: true,
  });

  if (process.env.PROXY_ICM || process.env.SSR_HYBRID) {
    logger.info("Making ICM available for all requests to '/INTERSHOP'");
    server.use('/INTERSHOP', icmProxy);
  }

  function defaultCacheControl(path: string): string {
    if (/\.[0-9a-f]{16,}\./.test(path)) {
      // file was output-hashed -> 1y
      return 'public, max-age=31557600';
    } else {
      // file should be re-checked more frequently -> 5m
      return 'public, max-age=300';
    }
  }

  const SOURCE_MAPS_ACTIVE = /on|1|true|yes/.test(process.env.SOURCE_MAPS?.toLowerCase());
  if (SOURCE_MAPS_ACTIVE) {
    logger.warn('SOURCE_MAPS are active - never use this in production!');
  }

  // Serve static files from browser folder
  server.get(/\/.*\.js\.map$/, (req, res, next) => {
    if (SOURCE_MAPS_ACTIVE) {
      return express.static(BROWSER_FOLDER, {
        setHeaders: (response, filePath) => {
          response.set('Cache-Control', defaultCacheControl(filePath));
        },
      })(req, res, next);
    } else {
      return res.sendStatus(404);
    }
  });
  server.get(/\/.*\.(js|css)$/, (req, res) => {
    // remove all parameters
    const path = req.originalUrl.slice(!DEPLOY_URL.startsWith('http') ? DEPLOY_URL.length : 0).replace(/[;?&].*$/, '');
    const filename = join(BROWSER_FOLDER, path);
    if (filename.startsWith(BROWSER_FOLDER)) {
      fs.readFile(filename, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          res.sendStatus(404);
        } else {
          res.set('Content-Type', `${path.endsWith('css') ? 'text/css' : 'application/javascript'}; charset=UTF-8`);
          res.set('Cache-Control', defaultCacheControl(path));
          res.send(setDeployUrlInFile(DEPLOY_URL, path, data));
        }
      });
    } else {
      res.sendStatus(404);
    }
  });

  server.purge(/\/PURGE_CACHE_ICM_CALLS$/, (_req, res) => {
    icmCallsCache.clear();
    res.sendStatus(200);
  });

  // route handler for all files that need the DEPLOY_URL replacement
  server.get(/\/assets\/.*|.*\.(woff2?|json)$|.*\/manifest\.webmanifest$/, (req, _, next) => {
    req.url = req.originalUrl.slice(!DEPLOY_URL.startsWith('http') ? DEPLOY_URL.length : 0).replace(/[;?&].*$/, '');
    next();
  });

  server.get(/^(?!\/assets\/).*\/favicon.ico.*/, (req, _, next) => {
    req.url = req.originalUrl.replace(/[;?&].*$/, '').replace(/^.*\//g, '/');
    next();
  });
  server.get(
    /.*\..*/,
    express.static(BROWSER_FOLDER, {
      setHeaders: (res, path) => {
        res.set('Cache-Control', defaultCacheControl(path));
        // add cors headers for required resources
        if (
          DEPLOY_URL.startsWith('http') &&
          ['manifest.webmanifest', 'woff2', 'woff', 'json'].some(match => path.endsWith(match))
        ) {
          res.set('access-control-allow-origin', '*');
        }
      },
    })
  );

  // complete setup and usage of Angular SSR engine
  const angularCommonEngine = (req: express.Request, res: express.Response) => {
    logger.info(getBaseLogData(req), 'SSR');

    if (req.originalUrl.startsWith('/assets/')) {
      logger.warn(
        {
          ...getBaseLogData(req),
          http: { response: { status_code: 404 } },
        },
        'RES 404 - Cannot serve static assets with Angular SSR'
      );
      return res.sendStatus(404);
    }

    if (req.headers.accept) {
      const accept = req.headers.accept.toLowerCase();
      if (!accept.includes('html') && ['css', 'image', 'json', 'javascript'].some(inc => accept.includes(inc))) {
        logger.warn(
          {
            ...getBaseLogData(req),
            http: { request: { mime_type: accept }, response: { status_code: 404 } },
          },
          'RES 404 - Accept header mismatch'
        );
        return res.sendStatus(404);
      }
    }

    // find last baseHref parameter
    const regex = /baseHref=([^;?#]*)/g;
    let baseHref = '/';
    for (let match: RegExpExecArray; (match = regex.exec(req.originalUrl));) {
      baseHref = match[1].replace(/%25/g, '%').replace(/%2F/g, '/');
    }

    commonEngine
      .render({
        url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
        documentFilePath: join(BROWSER_FOLDER, 'index.html'),
        publicPath: BROWSER_FOLDER,
        inlineCriticalCss: false,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseHref },
          { provide: REQUEST, useValue: req },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST_ID, useValue: getRequestId(req) },
        ],
      })
      .then(html => {
        if (html) {
          let newHtml = html;

          if (process.env.PROXY_ICM && req.get('host')) {
            newHtml = newHtml.replace(
              new RegExp(ICM_BASE_URL, 'g'),
              process.env.PROXY_ICM.startsWith('http') ? process.env.PROXY_ICM : `${req.protocol}://${req.get('host')}`
            );
          }

          newHtml = newHtml.replace(/<base href="[^>]*>/, `<base href="${baseHref}" />`);

          newHtml = setDeployUrlInFile(DEPLOY_URL, req.originalUrl, newHtml);

          res.status(res.statusCode).send(newHtml);
        } else {
          const errorMsg = `SSR rendering failed: No HTML generated for ${req.originalUrl}`;
          logger.error(
            {
              ...getBaseLogData(req),
              http: { response: { status_code: 500 } },
              error: { message: errorMsg },
            },
            'SSR rendering returned empty HTML'
          );
          res.status(500).send(errorMsg);
        }

        if (res.statusCode >= 500) {
          logger.error({ ...getBaseLogData(req), http: { response: { status_code: res.statusCode } } }, 'RES');
        } else if (res.statusCode >= 400) {
          logger.warn({ ...getBaseLogData(req), http: { response: { status_code: res.statusCode } } }, 'RES');
        } else {
          logger.info({ ...getBaseLogData(req), http: { response: { status_code: res.statusCode } } }, 'RES');
        }
      })
      .catch(err => {
        logger.error(
          {
            ...getBaseLogData(req),
            error: { message: err?.message || String(err), stack_trace: err?.stack },
          },
          'SSR rendering error'
        );
        res.status(500).send(err.message);
      });
  };

  if (/^(on|1|true|yes)$/i.test(process.env.PROMETHEUS)) {
    server.use((req, res, next) => {
      const start = Date.now();
      onFinished(res, () => {
        const duration = Date.now() - start;
        const matched = /;baseHref=([^;?]*)/.exec(req.originalUrl);
        let base_href = matched?.[1] ? `${decodeURIComponent(decodeURIComponent(matched[1]))}` : '/';
        if (!base_href.endsWith('/')) {
          base_href += '/';
        }
        const cleanUrl = req.originalUrl.replace(/[;?].*/g, '');
        const urlPath = cleanUrl.replace(base_href, '');

        if (collectDetailedMetrics) {
          requestCounts.inc({ method: req.method, status_code: res.statusCode, base_href, path: urlPath });
          requestDuration.labels({ status_code: res.statusCode, base_href, path: urlPath }).observe(duration / 1000);
          prometheusRest.forEach(({ endpoint, duration: restDuration }) => {
            restRequestDuration.labels({ endpoint }).observe(restDuration / 1000);
          });
          prometheusRest.length = 0;
        } else {
          basicRequestCounts.inc({ method: req.method, status_code: res.statusCode });
          basicRequestDuration.labels({ status_code: res.statusCode }).observe(duration / 1000);
        }
      });
      next();
    });
  }

  // set `Cache-Control: no-cache` header to all routes
  const setCacheControlHeader = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.set('Cache-Control', 'no-cache');
    next();
  };

  // All regular routes use the Angular engine with Cache-Control header
  server.use(/.*/, setCacheControlHeader, angularCommonEngine);

  logger.info({ url: { original: ICM_BASE_URL } }, 'ICM_BASE_URL configured');

  // running behind nginx - make sure to use all x-forwarded headers correctly
  // see https://expressjs.com/en/guide/behind-proxies.html
  server.set('trust proxy', true);

  // Disable Express x-powered-by header for security reasons
  server.disable('x-powered-by');

  return server;
}

if (/^(on|1|true|yes)$/i.test(process.env.PROMETHEUS)) {
  interface MetricsMessage {
    topic: string;
  }
  process.on('message', (msg: MetricsMessage) => {
    if (msg.topic === 'getMetrics') {
      client.register.getMetricsAsJSON().then((data: client.MetricObject[]) => {
        process.send({
          type: 'process:msg',
          data: {
            body: data,
            topic: 'returnMetrics',
          },
        });
      });
    }
  });
}

function run() {
  const http = require('http');
  http.createServer(app()).listen(PORT);
  collectDefaultMetrics({ prefix: 'pwa_' });
  logger.info(
    {
      host: { name: require('os').hostname() },
      server: { port: PORT },
    },
    'Node Express server started'
  );
  logger.info({ file: { directory: BROWSER_FOLDER } }, 'Serving static files');
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __non_webpack_require__: NodeJS.Require;

const mainModule = __non_webpack_require__.main;

const moduleFilename = mainModule?.filename || '';

if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
