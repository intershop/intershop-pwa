const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

if (!fs.existsSync('src/ssr/server-scripts/ecosystem-ports.json')) {
  console.error('ecosystem-ports.json not found. You have to execute "npm run build:multi" before.');
  process.exit(1);
}

const lockFile = JSON.parse(fs.readFileSync('./package-lock.json', { encoding: 'utf-8' }));
fs.writeFileSync(
  'dist/package.json',
  JSON.stringify(
    {
      dependencies: {
        pm2: lockFile.dependencies.pm2.version,
        express: lockFile.dependencies.express.version,
      },
    },
    undefined,
    2
  ),
  { encoding: 'utf-8' }
);

glob.sync('./src/ssr/server-scripts/*.js').forEach(file => {
  console.log('compiling', file);
  webpack(
    {
      entry: file,
      target: 'node',
      mode: 'production',
      externals: {
        pm2: 'commonjs pm2',
        express: 'commonjs express',
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              mangle: true,
            },
          }),
        ],
      },
      output: {
        path: path.join(process.cwd(), 'dist'),
        filename: path.basename(file),
      },
    },
    (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(stats);
        console.error('error compiling', file, err);
        process.exit(1);
      } else {
        process.stdout.write(stats.toString() + '\n\n\n');
      }
    }
  );
});
