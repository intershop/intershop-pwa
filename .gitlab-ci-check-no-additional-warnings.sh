#!/bin/sh

set -e

cat > tslint-hard.js <<EOF

var fs = require('fs');

var contents = fs.readFile('tslint.hard.json', 'utf8', function(err, contents) {
  const config = JSON.parse(contents);

  Object.keys(config.rules).filter(key => key !== 'no-disabled-tests').forEach(key => {
    if (config.rules[key].severity ==='warning') {
      config.rules[key].severity = 'error';
    }
  });

  fs.writeFileSync('tslint.hard.json', JSON.stringify(config));
});

EOF

cat tslint.json | grep -Ev '^\s*//' > tslint.hard.json

node tslint-hard

npx tslint --project tsconfig.json -c tslint.hard.json
