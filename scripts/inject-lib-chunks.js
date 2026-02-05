const fs = require('fs');
const path = require('path');

const theme = process.argv[2];
const distPath = theme
  ? path.join(__dirname, '..', 'dist', theme, 'browser')
  : path.join(__dirname, '..', 'dist', 'browser');
const indexPath = path.join(distPath, 'index.html');

const libChunks = [
  'ng-core',
  'ng-common',
  'ng-router',
  'rxjs',
  'lib-fontawesome',
  'lib-bootstrap',
  'lib-oauth',
  'lib-core',
];

console.log(`inject-lib-chunks: Processing ${theme ? theme + '/browser/' : ''}index.html`);

if (!fs.existsSync(indexPath)) {
  console.error(`inject-lib-chunks: index.html not found at ${indexPath}`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

const distFiles = fs.readdirSync(distPath);
const libFiles = distFiles.filter(f => libChunks.some(lib => f.startsWith(lib)) && f.endsWith('.js'));

const chunksToInject = libFiles.filter(file => !html.includes(file));

if (chunksToInject.length === 0) {
  console.log('inject-lib-chunks: no chunks to inject (already present)');
  process.exit(0);
}

const mainScriptMatch = html.match(/<script[^>]*src="[^"]*main[^"]*\.js"[^>]*><\/script>/i);
const mainScriptTag = mainScriptMatch?.[0];

const injectHtml = chunksToInject.map(file => `<script src="${file}" type="module"></script>`).join('');

if (mainScriptTag) {
  html = html.replace(mainScriptTag, injectHtml + mainScriptTag);
} else if (html.includes('</body>')) {
  html = html.replace('</body>', injectHtml + '</body>');
} else {
  console.error('inject-lib-chunks: could not find main script tag or </body>');
  process.exit(1);
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log(`inject-lib-chunks: injected ${chunksToInject.length} lib chunks`);
