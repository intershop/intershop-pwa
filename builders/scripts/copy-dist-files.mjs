import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(packageRoot, 'dist');
const require = createRequire(import.meta.url);
const buildAngularRoot = dirname(require.resolve('@angular-devkit/build-angular/package.json'));
const customEsbuildRoot = dirname(require.resolve('@angular-builders/custom-esbuild/package.json'));

mkdirSync(output, { recursive: true });
copyFileSync(join(packageRoot, 'builders.json'), join(output, 'builders.json'));
copyFileSync(join(buildAngularRoot, 'src/builders/extract-i18n/schema.json'), join(output, 'extract-i18n-schema.json'));
const applicationSchema = JSON.parse(readFileSync(join(customEsbuildRoot, 'dist/application/schema.json'), 'utf8'));
applicationSchema.properties.theme = {
  type: 'string',
  description: 'Theme used to discover TypeScript file replacements.',
};
writeFileSync(join(output, 'application-schema.json'), JSON.stringify(applicationSchema, undefined, 2));
copyFileSync(join(customEsbuildRoot, 'dist/dev-server/schema.json'), join(output, 'dev-server-schema.json'));
