const glob = require('glob');
const fs = require('fs');
const path = require('path');

function countFolders(path) {
  return (path.match(/\//g) || []).length;
}

const content = glob
  .sync('**/.gitignore')
  .sort((a, b) => countFolders(a) - countFolders(b))
  .map(gitignore => {
    const dir = path.dirname(gitignore);
    let part = `# from ${gitignore}\n`;
    part += fs
      .readFileSync(gitignore, { encoding: 'utf-8' })
      .split('\n')
      .filter(line => !/^#|^\s*$/.test(line))
      .map(line => {
        let linePart = '';
        if (line.startsWith('!')) {
          linePart += '!';
        }
        if (dir !== '.') {
          linePart += '/' + dir;
        }
        if (dir === '.' && !line.startsWith('/')) {
          linePart += '**/';
        }
        if (dir !== '.' && !line.startsWith('/')) {
          linePart += '/';
        }
        linePart += line.substring(line.startsWith('!/') ? 2 : line.startsWith('!') ? 1 : 0);

        return linePart;
      })
      .join('\n');

    return part;
  })
  .join('\n\n');

const dockerIgnore = fs.readFileSync('.dockerignore', { encoding: 'utf-8' });
const regex = /(dockerignore-update:start).*(dockerignore-update:end)/s;
if (!regex.test(dockerIgnore)) {
  console.error('could not find markers for synchronization in .dockerignore');
  process.exit(1);
}
const sync =
  "# The content between these markers is generated.\n# It can be synchronized using 'npm run update-dockerignore'";
const newDockerIgnore = dockerIgnore.replace(regex, (_, b, e) => `${b}\n\n${sync}\n\n${content}\n\n${sync}\n\n# ${e}`);

if (dockerIgnore !== newDockerIgnore) {
  fs.writeFileSync('.dockerignore', newDockerIgnore);
  console.log('updated .dockerignore');
} else {
  console.log('.dockerignore is up-to-date');
}
