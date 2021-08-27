const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const glob = require('glob');

glob.sync('./src/ssr/server-scripts/*.js').forEach(file => {
  console.log('compiling', file);
  webpack(
    {
      entry: file,
      target: 'node',
      mode: 'production',
      externals: {
        pm2: 'commonjs pm2',
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
