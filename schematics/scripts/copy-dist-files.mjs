import { copyFileSync, existsSync, mkdirSync, statSync } from 'fs';
import globModule from 'glob';
import { dirname } from 'path';

const { sync } = globModule;

[...sync('src/**/{collection,schema}.json'), ...sync('src/**/files/**')]
  .filter(f => statSync(f).isFile())
  .forEach(file => {
    const target = file.replace(/^src/, 'dist');

    if (!existsSync(dirname(target))) {
      mkdirSync(dirname(target), { recursive: true });
    }

    copyFileSync(file, target);
  });
