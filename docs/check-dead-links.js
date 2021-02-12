const fs = require('fs');
const path = require('path');
const async = require('async');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const { spawnSync } = require('child_process');

async function checkExternalLinkError(link) {
  console.log('check', link);
  const client = link.startsWith('https') ? require('https') : require('http');
  return new Promise(resolve => {
    const req = client.request(link, res => {
      isError = res.statusCode >= 400;
      if (isError) {
        console.warn('found dead link to', link);
      }
      resolve(isError);
    });

    req.on('error', () => {
      console.warn('found dead link to', link);
      resolve(true);
    });
    req.end();
  });
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function getLineInfoOfString(data, str) {
  var perLine = data.split('\n');
  for (let line = 0; line < perLine.length; line++) {
    const index = perLine[line].indexOf(str);
    if (index > 0) {
      return ':' + (line + 1) + ':' + (index + 1);
    }
  }
  return '';
}

let gitChanged =
  process.argv[2] &&
  process.argv[2] !== 'fast' &&
  spawnSync('git', ['--no-pager', 'diff', process.argv[2], '--name-only'])
    .stdout.toString('utf-8')
    .split('\n')
    .filter(path => path.endsWith('.md'));

glob('**/*.md')
  .then(files => {
    const externalLinks = [];
    let isError = false;

    files
      .filter(file => !file.includes('node_modules/') && !file.includes('dist/'))
      .forEach(file => {
        const content = fs.readFileSync(file, { encoding: 'utf-8' });
        const match = content.match(/\[.*?\](\(|:\ +)[^\s]*\)?/g);
        if (match) {
          match.forEach(link => {
            const linkTo = /\](\(<?|:\s+)(.*?)(>?\)|$|#)/.exec(link)[2];

            if (linkTo) {
              // link is not document-internal
              if (linkTo.startsWith('http')) {
                if (!gitChanged || gitChanged.includes(file)) {
                  externalLinks.push(linkTo);
                }
              } else {
                const normalized = path.normalize(path.join(path.dirname(file), linkTo));
                if (!fs.existsSync(normalized)) {
                  console.warn(file + getLineInfoOfString(content, linkTo) + ': found dead link to "' + linkTo + '"');
                  isError = true;
                }
              }
            }
          });
        }
      });
    if (isError) {
      throw new Error('found dead internal links');
    }
    return externalLinks;
  })
  .then(externalLinks => {
    if (process.argv.length > 2 && process.argv[2] === 'fast') {
      console.warn('skipping external link check');
      return;
    }

    const filtered = externalLinks
      .map(link => link.replace(/\/$/, ''))
      .filter((val, idx, arr) => arr.indexOf(val) === idx)
      .filter(
        link =>
          !link.includes('tacton.com') &&
          !link.includes('repository.intershop.de') &&
          !link.includes('support.intershop.') &&
          !link.includes('docs.intershop.') &&
          !link.includes('azurewebsites.net') &&
          !link.includes('github.com') &&
          !link.includes('github.com/intershop/intershop-pwa/commit')
      )
      .sort();

    async.eachSeries(
      filtered,
      async link => {
        const isError = await checkExternalLinkError(link);
        if (isError) throw new Error('found dead external link');
        await sleep(1000);
      },
      err => {
        if (err) throw err;
      }
    );
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
