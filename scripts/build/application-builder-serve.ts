import { spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import { join } from 'path';

/* eslint-disable no-console */

interface ServeOptions {
  browserFolder: string;
  port: string;
  serverEntry: string;
}

function parseArgs(args: string[]): ServeOptions {
  return args.reduce<ServeOptions>(
    (options, arg) => {
      if (arg.startsWith('--port=')) {
        return { ...options, port: arg.split('=')[1] };
      }
      if (arg.startsWith('--browser-folder=')) {
        return { ...options, browserFolder: arg.split('=')[1] };
      }
      if (arg.startsWith('--server-entry=')) {
        return { ...options, serverEntry: arg.split('=')[1] };
      }
      return options;
    },
    {
      browserFolder: process.env.BROWSER_FOLDER || join(process.cwd(), 'dist', 'application-spike', 'browser'),
      port: process.env.PORT || '4300',
      serverEntry: join('dist', 'application-spike', 'server', 'server.mjs'),
    }
  );
}

function startServer(options: ServeOptions): ChildProcess {
  console.log(`serve:application-spike: starting ${options.serverEntry} on port ${options.port}`);
  return spawn('node', [options.serverEntry], {
    env: {
      ...process.env,
      BROWSER_FOLDER: options.browserFolder,
      PORT: options.port,
    },
    stdio: 'inherit',
  });
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  let server = startServer(options);
  let lastServerMtime = fs.existsSync(options.serverEntry) ? fs.statSync(options.serverEntry).mtimeMs : 0;

  const timer = setInterval(() => {
    if (!fs.existsSync(options.serverEntry)) {
      return;
    }

    const serverMtime = fs.statSync(options.serverEntry).mtimeMs;
    if (serverMtime === lastServerMtime) {
      return;
    }

    lastServerMtime = serverMtime;
    console.log('serve:application-spike: server bundle changed, restarting');
    server.kill();
    server = startServer(options);
  }, 1000);

  const shutdown = () => {
    clearInterval(timer);
    server.kill();
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

run();
