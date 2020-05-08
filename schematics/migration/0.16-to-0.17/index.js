const { exec, execSync } = require('child_process');
const fs = require('fs');
const glob = require('glob');

const NOTHING_TO_BE_DONE = 'Nothing to be done.';

exec('npx ng g decontainerize-0.16-to-0.17', (err, stdout, stderr) => {
  if (err) {
    console.error(stderr);
    process.exit(1);
  }

  if (stdout.trim() !== NOTHING_TO_BE_DONE) {
    console.log('successfully performed de-containerization');
  }

  glob('src/app/**/*.component.ts', function (er, files) {
    let update = false;
    files.forEach(file => {
      if (/^src\/app\/.*\/(containers|components)\/.*\.component\.ts$/.test(file)) {
        const from = file.replace(/\/[^\/]*$/, '').replace(/^\//, '');
        let to;
        if (/.*\/(shell|extensions|pages)\/.*/.test(from)) {
          to = from.replace(/(containers|components)\//, '');
        } else if (from.includes('/shared/')) {
          const group = /shared\/(components\/|)([a-z-]+)\//.exec(from)[2];
          const name = from.substr(from.lastIndexOf('/') + 1);
          if (fs.existsSync(`src/app/shared/${group}/${group}.module.ts`)) {
            to = `src/app/shared/${group}/components/${name}`;
          } else {
            to = `src/app/shared/components/${group}/${name}`;
          }
        }

        if (to) {
          if (to !== from) {
            console.log('moving', from, '\n    to', to);
            execSync(`npx ng g move-component ${from} ${to}`);
            update = true;
          }
        } else {
          console.warn('unhandled', from);
        }
      }
    });

    if (!update) {
      console.log(NOTHING_TO_BE_DONE);
    } else {
      console.log('formatting');
      execSync('npm run format');
      console.log('updating snapshots');
      execSync('npx jest -u');
      console.log('linting');
      execSync('npm run lint -- --fix');
    }
  });
});
