const cypress = require('cypress/lib/cli');
const fs = require('fs');

let icmBaseUrl;
if (process.env.ICM_BASE_URL) {
  icmBaseUrl = process.env.ICM_BASE_URL;
  console.log('found ICM_BASE_URL environment variable');
} else if (fs.existsSync('../src/environments/environment.local.ts')) {
  console.log('using ICM_BASE_URL from environment.local.ts');
  const data = fs.readFileSync('../src/environments/environment.local.ts', 'UTF-8');

  const regex = /^ *icmBaseURL: '(.*?)',/m;
  icmBaseUrl = data.match(regex)[1];
} else {
  console.error(
    'Did not find a valid ICM_BASE_URL. Setup a environment.local.ts or supply it via environment variable.'
  );
  process.exit(1);
}

console.log('using', icmBaseUrl, 'as ICM_BASE_URL');

const args = process.argv.slice(0, 2);
args.push('open', '-e', 'ICM_BASE_URL=' + icmBaseUrl);
if (process.argv.length > 2) {
  args.push(...process.argv.slice(2));
}

cypress.init(args);
