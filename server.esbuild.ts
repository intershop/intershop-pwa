import { join } from 'node:path';

globalThis.ngServerMode = true;

process.env.BROWSER_FOLDER ??= join(process.cwd(), 'dist', 'esbuild', 'browser');

process.env.INDEX_FILE ??= join(process.cwd(), 'dist', 'esbuild', 'server', 'index.server.html');

void import('./server').then(({ run }) => run());
