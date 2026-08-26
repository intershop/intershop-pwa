import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(packageRoot, 'dist');
const require = createRequire(import.meta.url);
const buildAngularRoot = dirname(require.resolve('@angular-devkit/build-angular/package.json'));

mkdirSync(output, { recursive: true });
copyFileSync(join(packageRoot, 'builders.json'), join(output, 'builders.json'));
copyFileSync(join(buildAngularRoot, 'src/builders/extract-i18n/schema.json'), join(output, 'extract-i18n-schema.json'));
