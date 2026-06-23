import { spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import { join, resolve } from 'path';

/* eslint-disable no-console */

interface ServeOptions {
  browserFolder: string;
  port: string;
  serverEntry: string;
}

function parseArgs(args: string[]): ServeOptions {
  const options = args.reduce<ServeOptions>(
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

  return {
    ...options,
    browserFolder: resolve(options.browserFolder),
    serverEntry: resolve(options.serverEntry),
  };
}

function getRequiredFiles(options: ServeOptions): string[] {
  return [options.serverEntry, join(options.browserFolder, 'index.html')];
}

function getMissingRequiredFiles(options: ServeOptions): string[] {
  return getRequiredFiles(options).filter(file => !fs.existsSync(file));
}

function startServer(options: ServeOptions): ChildProcess | undefined {
  const missingFiles = getMissingRequiredFiles(options);
  if (missingFiles.length) {
    console.log(`serve:application-spike: waiting for ${missingFiles.join(', ')}`);
    return undefined;
  }

  console.log(`serve:application-spike: starting ${options.serverEntry} on port ${options.port}`);
  return spawn('node', [options.serverEntry], {
    env: {
      ...process.env,
      APPLICATION_BUILDER_LIVE_RELOAD: 'true',
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
    const missingFiles = getMissingRequiredFiles(options);
    if (missingFiles.length) {
      if (server) {
        console.log(`serve:application-spike: output incomplete, stopping server until rebuild completes`);
        server.kill();
        server = undefined;
      }
      return;
    }

    const serverMtime = fs.statSync(options.serverEntry).mtimeMs;
    if (server && serverMtime === lastServerMtime) {
      return;
    }

    lastServerMtime = serverMtime;
    if (server) {
      console.log('serve:application-spike: server bundle changed, restarting');
      server.kill();
    }
    server = startServer(options);
  }, 1000);

  const shutdown = () => {
    clearInterval(timer);
    server?.kill();
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

run();
