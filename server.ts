// tslint:disable: no-console ish-ordered-imports force-jsdoc-comments
import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';
import * as robots from 'express-robots-txt';
import * as fs from 'fs';
import * as proxy from 'express-http-proxy';
// tslint:disable-next-line: ban-specific-imports
import { AppServerModule, ICM_WEB_URL, HYBRID_MAPPING_TABLE, environment, APP_BASE_HREF } from './src/main.server';
import { ngExpressEngine } from '@nguniversal/express-engine';

const PORT = process.env.PORT || 4200;

const DIST_FOLDER = join(process.cwd(), 'dist');

// uncomment this block to prevent ssr issues with third-party libraries regarding window, document, HTMLElement and navigator
// tslint:disable-next-line: no-commented-out-code
/*
const domino = require('domino');
const template = fs.readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
const win = domino.createWindow(template);

// tslint:disable:no-string-literal
global['window'] = win;
global['document'] = win.document;
global['HTMLElement'] = win.HTMLElement;
global['navigator'] = win.navigator;
// tslint:enable:no-string-literal
*/

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const logging = /on|1|true|yes/.test(process.env.LOGGING?.toLowerCase());

  const ICM_BASE_URL = process.env.ICM_BASE_URL || environment.icmBaseURL;
  if (!ICM_BASE_URL) {
    console.error('ICM_BASE_URL not set');
    process.exit(1);
  }

  if (process.env.TRUST_ICM) {
    // trust https certificate if self-signed
    // see also https://medium.com/nodejs-tips/ssl-certificate-explained-fc86f8aa43d4
    // and https://github.com/angular/universal/issues/856#issuecomment-436364729
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.warn("ignoring all TLS verification as 'TRUST_ICM' variable is set - never use this in production!");
  }

  // Express server
  const server = express();

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      providers: [{ provide: 'SSR_HYBRID', useValue: !!process.env.SSR_HYBRID }],
    })
  );

  server.set('view engine', 'html');
  server.set('views', join(DIST_FOLDER, 'browser'));

  if (logging) {
    server.use(
      require('morgan')('tiny', {
        skip: req => req.originalUrl.startsWith('/INTERSHOP/static'),
      })
    );
  }

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
          '/account',
          '/compare',
          '/recently',
          '/basket',
          '/checkout',
          '/register',
          '/login',
          '/logout',
          '/forgotPassword',
          '/contact',
        ],
      })
    );
  }

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(join(DIST_FOLDER, 'browser'), {
      setHeaders: (res, path) => {
        if (/\.[0-9a-f]{20,}\./.test(path)) {
          // file was output-hashed -> 1y
          res.set('Cache-Control', 'public, max-age=31557600');
        } else {
          // file should be re-checked more frequently -> 5m
          res.set('Cache-Control', 'public, max-age=300');
        }
      },
    })
  );

  const icmProxy = proxy(ICM_BASE_URL, {
    // preserve original path
    proxyReqPathResolver: req => req.originalUrl,
    proxyReqOptDecorator: options => {
      if (process.env.TRUST_ICM) {
        // https://github.com/villadora/express-http-proxy#q-how-to-ignore-self-signed-certificates-
        options.rejectUnauthorized = false;
      }
      return options;
    },
    // fool ICM so it thinks it's running here
    // https://www.npmjs.com/package/express-http-proxy#preservehosthdr
    preserveHostHdr: true,
  });

  const angularUniversal = (req: express.Request, res: express.Response) => {
    if (logging) {
      console.log(`SSR ${req.originalUrl}`);
    }

    if (req.originalUrl.startsWith('/assets/')) {
      if (logging) {
        console.log(`RES 404 ${req.originalUrl} - cannot serve static assets with Angular Universal`);
      }
      return res.sendStatus(404);
    }

    if (req.headers.accept) {
      const accept = req.headers.accept.toLowerCase();
      if (!accept.includes('html') && ['css', 'image', 'json', 'javascript'].some(inc => accept.includes(inc))) {
        if (logging) {
          console.log(`RES 404 ${req.originalUrl} - accept header mismatch '${accept}'`);
        }
        return res.sendStatus(404);
      }
    }

    // find last baseHref parameter
    const regex = /baseHref=([^;\?\#]*)/g;
    let baseHref = '/';
    for (let match: RegExpExecArray; (match = regex.exec(req.originalUrl)); ) {
      baseHref = match[1].replace(/%25/g, '%').replace(/%2F/g, '/');
    }

    res.render(
      'index',
      {
        req,
        res,
        providers: [{ provide: APP_BASE_HREF, useValue: baseHref }],
      },
      (err, html) => {
        if (html) {
          let newHtml = html;
          if (process.env.PROXY_ICM && req.get('host')) {
            newHtml = newHtml.replace(
              new RegExp(ICM_BASE_URL, 'g'),
              process.env.PROXY_ICM.startsWith('http') ? process.env.PROXY_ICM : `${req.protocol}://${req.get('host')}`
            );
          }
          newHtml = newHtml.replace(/<base href="[^>]*>/, `<base href="${baseHref}" />`);

          res.status(res.statusCode).send(newHtml || html);
        } else {
          res.status(500).send(err.message);
        }
        if (logging) {
          console.log(`RES ${res.statusCode} ${req.originalUrl}`);
          if (err) {
            console.log(err);
          }
        }
      }
    );
  };

  const hybridRedirect = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const url = req.originalUrl;
    let newUrl: string;
    for (const entry of HYBRID_MAPPING_TABLE) {
      const icmUrlRegex = new RegExp(entry.icm);
      const pwaUrlRegex = new RegExp(entry.pwa);
      if (icmUrlRegex.exec(url) && entry.handledBy === 'pwa') {
        newUrl = url.replace(icmUrlRegex, '/' + entry.pwaBuild);
        break;
      } else if (pwaUrlRegex.exec(url) && entry.handledBy === 'icm') {
        const config: { [is: string]: string } = {};
        let locale;
        if (/;lang=[\w_]+/.test(url)) {
          const [, lang] = /;lang=([\w_]+)/.exec(url);
          if (lang !== 'default') {
            locale = environment.locales.find(loc => loc.lang === lang);
          }
        }
        if (!locale) {
          locale = environment.locales[0];
        }
        config.lang = locale.lang;
        config.currency = locale.currency;

        if (/;channel=[^;]*/.test(url)) {
          config.channel = /;channel=([^;]*)/.exec(url)[1];
        } else {
          config.channel = environment.icmChannel;
        }

        if (/;application=[^;]*/.test(url)) {
          config.application = /;application=([^;]*)/.exec(url)[1];
        } else {
          config.application = environment.icmApplication || '-';
        }

        const build = [ICM_WEB_URL, entry.icmBuild]
          .join('/')
          .replace(/\$<(\w+)>/g, (match, group) => config[group] || match);
        newUrl = url.replace(pwaUrlRegex, build).replace(/;.*/g, '');
        break;
      }
    }
    if (newUrl) {
      if (logging) {
        console.log('RED', newUrl);
      }
      res.redirect(301, newUrl);
    } else {
      next();
    }
  };

  if (process.env.SSR_HYBRID) {
    server.use('*', hybridRedirect);
  }

  if (process.env.PROXY_ICM || process.env.SSR_HYBRID) {
    console.log("making ICM available for all requests to '/INTERSHOP'");
    server.use('/INTERSHOP', icmProxy);
  }

  if (/^(on|1|true|yes)$/i.test(process.env.PROMETHEUS)) {
    const promBundle = require('express-prom-bundle');
    server.use('*', promBundle({ buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 2, 3, 4, 5] }));
  }

  // All regular routes use the Universal engine
  server.use('*', angularUniversal);

  console.log('ICM_BASE_URL is', ICM_BASE_URL);

  return server;
}

function run() {
  if (process.env.SSL) {
    const https = require('https');
    const privateKey = fs.readFileSync(join(DIST_FOLDER, 'server.key'), 'utf8');
    const certificate = fs.readFileSync(join(DIST_FOLDER, 'server.crt'), 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    https.createServer(credentials, app()).listen(PORT);

    console.log(`Node Express server listening on https://${require('os').hostname()}:${PORT}`);
  } else {
    const http = require('http');

    http.createServer(app()).listen(PORT);

    console.log(`Node Express server listening on http://${require('os').hostname()}:${PORT}`);
  }
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;

const mainModule = __non_webpack_require__.main;

const moduleFilename = (mainModule && mainModule.filename) || '';

if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
