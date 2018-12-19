const cypress = require('cypress/lib/cli');
var readFileSync = require('fs').readFileSync;

const data = readFileSync('./src/environments/environment.local.ts', 'UTF-8');

const regex = /^ *icmBaseURL: '(.*?)',/m;
const match = data.match(regex)[1];

console.log('using', match, 'as ICM_BASE_URL');

const args = process.argv.slice(0,2);
args.push('open', '-e', 'ICM_BASE_URL=' + match);
if (process.argv.length > 2) {
  args.push(...process.argv.slice(2));
}

cypress.init(args);
