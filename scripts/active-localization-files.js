const fs = require('fs');
const { globSync } = require('glob');
const path = require('path');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
  } catch (error) {
    throw new Error(`Cannot read build metadata ${file}`, { cause: error });
  }
}

function normalizeSource(source) {
  return source.replace(/\\/g, '/').replace(/^\.\//, '');
}

function isWorkspaceSource(source) {
  return ['src/', 'projects/'].some(folder => source.startsWith(folder));
}

function validateStats(stats, theme) {
  const statsInputs = stats?.inputs && typeof stats.inputs === 'object' ? Object.keys(stats.inputs) : [];
  if (!statsInputs.map(normalizeSource).some(source => isWorkspaceSource(source) && source.endsWith('.ts'))) {
    throw new Error(`Build metadata for "${theme}" contains no workspace TypeScript inputs.`);
  }
}

function collectWorkspaceSources(sourceMaps, theme) {
  const files = [
    ...new Set(
      sourceMaps
        .flatMap(sourceMap => {
          if (!Array.isArray(sourceMap.sources)) {
            throw new Error(`Source map for "${theme}" has no sources.`);
          }
          return sourceMap.sources;
        })
        .map(normalizeSource)
        .filter(isWorkspaceSource)
        .filter(source => ['.ts', '.html', '.scss'].some(extension => source.endsWith(extension)))
    ),
  ].sort();

  for (const extension of ['.ts', '.html']) {
    if (!files.some(file => file.endsWith(extension))) {
      throw new Error(`Source maps for "${theme}" contain no workspace ${extension} files.`);
    }
  }

  return files;
}

function loadSourceMapFiles(buildFolder, theme) {
  const sourceMapPaths = globSync(`${normalizeSource(buildFolder)}/browser/**/*.{js,css}.map`, { nodir: true });
  if (!sourceMapPaths.length) {
    throw new Error(`Build output for "${theme}" contains no JavaScript or CSS source maps.`);
  }

  return collectWorkspaceSources(sourceMapPaths.map(readJson), theme);
}

function loadActiveLocalizationFiles(buildFolder, theme) {
  validateStats(readJson(path.join(buildFolder, 'stats.json')), theme);
  return loadSourceMapFiles(buildFolder, theme);
}

module.exports = { collectWorkspaceSources, loadActiveLocalizationFiles, loadSourceMapFiles, validateStats };
