const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const distFolder = __dirname;
let ports = JSON.parse(readFileSync(join(distFolder, 'ecosystem-ports.json'), { encoding: 'utf-8' }));

if (process.env.ACTIVE_THEMES) {
  const activeThemes = process.env.ACTIVE_THEMES.split(',').map(theme => theme.trim());
  ports = Object.fromEntries(Object.entries(ports).filter(([theme]) => activeThemes.includes(theme)));
}

const themes = Object.keys(ports);
if (!themes.length) {
  console.error('ACTIVE_THEMES does not contain a built theme.');
  process.exit(1);
}

const apps = [];

if (themes.length === 1) {
  ports[themes[0]] = Number(process.env.PORT) || 4200;
} else {
  apps.push({
    name: 'distributor',
    script: join(distFolder, 'distributor.cjs'),
  });
}

if (/^(on|1|true|yes)$/i.test(process.env.PROMETHEUS)) {
  apps.push({
    name: 'prometheus',
    script: join(distFolder, 'prometheus.cjs'),
  });
}

const configuredInstances = process.env.CONCURRENCY_SSR || '2';
const instances = configuredInstances === 'max' ? 'max' : Number(configuredInstances);

Object.entries(ports).forEach(([theme, port]) => {
  apps.push({
    name: theme,
    script: join(distFolder, theme, 'server', 'server.mjs'),
    instances: Number.isNaN(instances) ? 2 : instances,
    exec_mode: 'cluster',
    max_memory_restart: process.env.SSR_MAX_MEM || '600M',
    env: {
      BROWSER_FOLDER: join(distFolder, theme, 'browser'),
      DIST_FOLDER: join(distFolder, theme),
      PORT: port,
      THEME: theme,
    },
  });
});

writeFileSync(join(distFolder, 'ecosystem.json'), JSON.stringify({ apps }, undefined, 2));
