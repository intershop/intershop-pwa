import axios from 'axios';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import globModule from 'glob';
import * as path from 'path';

const { sync } = globModule;

async function mapSeries(iterable, action) {
  for (const x of iterable) {
    await action(x);
  }
}

const linkCheck = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  },
});

linkCheck.interceptors.response.use(
  response => response,
  error => {
    // ignore 403 (authentication required)
    if (error.response?.status === 403) {
      return null;
    }
    return Promise.reject({ message: `Request failed with status code ${error.response?.status}` });
  }
);

async function checkExternalLinkError(link) {
  console.log('check', link);

  return linkCheck.head(link).catch(() =>
    // retry with get
    linkCheck.get(link)
  );
}

function getLineInfoOfString(data, str) {
  var perLine = data.split('\n');
  for (let line = 0; line < perLine.length; line++) {
    const index = perLine[line].indexOf(str);
    if (index > 0) {
      return `:${line + 1}:${index + 1}`;
    }
  }
  return '';
}

const fastCheck = process.argv.slice(2).includes('fast');

const rev = process.argv.slice(2).filter(arg => arg !== 'fast')[0];

let gitChanged =
  rev &&
  spawnSync('git', ['--no-pager', 'diff', rev, '--name-only'])
    .stdout.toString('utf-8')
    .split('\n')
    .filter(path => path.endsWith('.md'));

const files = sync('**/*.md').filter(
  file => !file.includes(`node_modules${path.sep}`) && !file.includes(`dist${path.sep}`)
);

const externalLinks = [];
let isError = false;

files.forEach(file => {
  const content = fs.readFileSync(file, { encoding: 'utf-8' });
  const match = content.match(/\[.*?\](\(|: +)[^\s]*\)?/g);
  if (match) {
    match.forEach(link => {
      const linkTo = /\](\(<?|:\s+)(.*?)(>?\)|$|#)/.exec(link)[2];

      if (linkTo) {
        // link is not document-internal
        if (linkTo.startsWith('http')) {
          if (!gitChanged || gitChanged.includes(file)) {
            externalLinks.push(linkTo.replace(/\/$/, ''));
          }
        } else {
          const normalized = path.normalize(path.join(path.dirname(file), linkTo));
          if (!fs.existsSync(normalized)) {
            console.warn(`${file + getLineInfoOfString(content, linkTo)}: found dead link to "${linkTo}"`);
            isError = true;
          }
        }
      }
    });
  }
});

if (isError) {
  console.error('found dead internal links');
  process.exit(1);
}

if (fastCheck) {
  console.warn('skipping external link check');
  process.exit(0);
}

const filtered = externalLinks
  .filter((val, idx, arr) => arr.indexOf(val) === idx)
  .filter(
    link =>
      !link.includes('repository.intershop.de') &&
      !link.includes('support.intershop.') &&
      !link.includes('docs.intershop.') &&
      !link.includes('azurewebsites.net') &&
      !link.includes('github.com')
  );

mapSeries(filtered, checkExternalLinkError).catch(error => {
  console.error(error.message);
  process.exit(1);
});
