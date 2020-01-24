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

const logging = !!process.env.LOGGING;

// Express server
const app = express();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap } = require('./dist/server/main');

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

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
  const icmBaseUrl = process.env.ICM_BASE_URL;
  if (icmBaseUrl) {
    console.log('ICM_BASE_URL is', icmBaseUrl);
  }
});
