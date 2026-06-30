import { spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import { join, resolve } from 'path';

/* eslint-disable no-console */

interface ServeOptions {
  browserFolder: string;
  liveReload: boolean;
  port: string;
  serverEntry: string;
}

function parseArgs(args: string[]): ServeOptions {
  const options = args.reduce<ServeOptions>(
    (parsedOptions, arg) => {
      if (arg.startsWith('--port=')) {
        return { ...parsedOptions, port: arg.split('=')[1] };
      }
      if (arg.startsWith('--browser-folder=')) {
        return { ...parsedOptions, browserFolder: arg.split('=')[1] };
      }
      if (arg.startsWith('--server-entry=')) {
        return { ...parsedOptions, serverEntry: arg.split('=')[1] };
      }
      if (arg === '--live-reload' || arg === '--live-reload=true') {
        return { ...parsedOptions, liveReload: true };
      }
      if (arg === '--live-reload=false') {
        return { ...parsedOptions, liveReload: false };
      }
      return parsedOptions;
    },
    {
      browserFolder: process.env.BROWSER_FOLDER || join(process.cwd(), 'dist', 'application-builder', 'browser'),
      liveReload: /^(on|1|true|yes)$/i.test(process.env.APPLICATION_BUILDER_LIVE_RELOAD || ''),
      port: process.env.PORT || '4300',
      serverEntry: join('dist', 'application-builder', 'server', 'server.mjs'),
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
    console.log(`serve:application-builder: waiting for ${missingFiles.join(', ')}`);
    return;
  }

  console.log(`serve:application-builder: starting ${options.serverEntry} on port ${options.port}`);
  return spawn('node', [options.serverEntry], {
    env: {
      ...process.env,
      APPLICATION_BUILDER_LIVE_RELOAD: options.liveReload ? 'true' : 'false',
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
        console.log(`serve:application-builder: output incomplete, stopping server until rebuild completes`);
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
      console.log('serve:application-builder: server bundle changed, restarting');
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
