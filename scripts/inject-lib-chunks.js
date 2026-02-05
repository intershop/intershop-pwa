const fs = require('fs');
const path = require('path');

// Support theme argument for multi-build: node scripts/inject-lib-chunks [theme]
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

console.log('inject-lib-chunks: Processing index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`inject-lib-chunks: index.html not found at ${indexPath}`);
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Find all lib-*.js files in dist
const distFiles = fs.readdirSync(distPath);
const libFiles = distFiles.filter(f => libChunks.some(lib => f.startsWith(lib)) && f.endsWith('.js'));

console.log(`inject-lib-chunks: found lib chunks: ${libFiles.join(', ')}`);

// Find main script tag
const mainScriptMatch = /<script\s+src="main[^"]*\.js"\s+type="module"><\/script>/.exec(html);

if (!mainScriptMatch) {
  console.error('inject-lib-chunks: could not find main script tag');
  process.exit(1);
}

const mainScriptTag = mainScriptMatch[0];
let injectHtml = '';

libFiles.forEach(file => {
  if (!html.includes(file)) {
    injectHtml += `<script src="${file}" type="module"></script>`;
    console.log(`inject-lib-chunks: injecting ${file}`);
  }
});

if (injectHtml) {
  html = html.replace(mainScriptTag, injectHtml + mainScriptTag);
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log('inject-lib-chunks: successfully injected lib chunks');
} else {
  console.log('inject-lib-chunks: no chunks to inject (already present)');
}
