// tslint:disable: no-console ish-ordered-imports
/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */

import 'zone.js/dist/zone-node';

import * as express from 'express';
import { join } from 'path';
import * as robots from 'express-robots-txt';
import * as fs from 'fs';
import * as proxy from 'express-http-proxy';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  ngExpressEngine,
  provideModuleMap,
  environment,
} = require('./dist/server/main');

const logging = !!process.env.LOGGING;

// Express server
const app = express();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');

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
}

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
  })
);

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// seo robots.txt
const pathToRobotsTxt = join(DIST_FOLDER, 'robots.txt');
if (fs.existsSync(pathToRobotsTxt)) {
  app.use(robots(pathToRobotsTxt));
} else {
  app.use(
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

if (process.env.PROXY_ICM) {
  app.use(
    '/' + environment.icmURLPrefix,
    proxy(ICM_BASE_URL, {
      proxyReqOptDecorator: (proxyReqOpts, originalReq) => {
        originalReq.url = `/${environment.icmURLPrefix}${originalReq.url}`;

        if (process.env.TRUST_ICM) {
          // https://github.com/villadora/express-http-proxy#q-how-to-ignore-self-signed-certificates-
          proxyReqOpts.rejectUnauthorized = false;
        }
        return proxyReqOpts;
      },
      // fool ICM so it thinks it's running here
      // https://www.npmjs.com/package/express-http-proxy#preservehosthdr
      preserveHostHdr: true,
    })
  );
}

// Serve static files from /browser
app.get(
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

// All regular routes use the Universal engine
app.get('*', (req: express.Request, res: express.Response) => {
  if (logging) {
    console.log(`GET ${req.url}`);
  }
  res.render(
    'index',
    {
      req,
      res,
    },
    (err: Error, html: string) => {
      res.status(html ? res.statusCode : 500).send(html || err.message);
      if (logging) {
        console.log(`RES ${res.statusCode} ${req.url}`);
        if (err) {
          console.log(err);
        }
      }
    }
  );
});

if (process.env.SSL) {
  const https = require('https');
  const privateKey = fs.readFileSync(join(DIST_FOLDER, 'server.key'), 'utf8');
  const certificate = fs.readFileSync(join(DIST_FOLDER, 'server.crt'), 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  https.createServer(credentials, app).listen(PORT);

  console.log(`Node Express server listening on https://localhost:${PORT}`);
} else {
  const http = require('http');

  http.createServer(app).listen(PORT);

  console.log(`Node Express server listening on http://localhost:${PORT}`);
}

console.log('ICM_BASE_URL is', ICM_BASE_URL);
