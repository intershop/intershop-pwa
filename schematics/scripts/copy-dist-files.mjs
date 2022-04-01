import { copyFileSync, existsSync, mkdirSync, statSync } from 'fs';
import glob from 'glob';
import { dirname } from 'path';

[...glob.sync('src/**/{collection,schema}.json'), ...glob.sync('src/**/files/**')]
  .filter(f => statSync(f).isFile())
  .forEach(file => {
    const target = file.replace(/^src/, 'dist');

    if (!existsSync(dirname(target))) {
      mkdirSync(dirname(target), { recursive: true });
    }

    copyFileSync(file, target);
  });
