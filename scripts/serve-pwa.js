const { spawn } = require('child_process');
const { join } = require('path');

function parseArgs(args) {
  return args.reduce(
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
      browserFolder: process.env.BROWSER_FOLDER || join(process.cwd(), 'dist', 'browser'),
      port: process.env.PORT,
      serverEntry: join('dist', 'server', 'main.js'),
    }
  );
}

const options = parseArgs(process.argv.slice(2));
const server = spawn(process.execPath, [options.serverEntry], {
  env: {
    ...process.env,
    BROWSER_FOLDER: options.browserFolder,
    ...(options.port ? { PORT: options.port } : {}),
  },
  stdio: 'inherit',
  windowsHide: true,
});

server.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 0);
});
