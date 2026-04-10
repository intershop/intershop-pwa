import { copyFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { globSync } from 'glob';
import { dirname } from 'path';

[...globSync('src/**/{collection,schema}.json'), ...globSync('src/**/files/**')]
  .filter(f => statSync(f).isFile())
  .forEach(file => {
    const target = file.replace(/^src/, 'dist');

    if (!existsSync(dirname(target))) {
      mkdirSync(dirname(target), { recursive: true });
    }

    copyFileSync(file, target);
  });
