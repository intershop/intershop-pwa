const fs = require('fs');
let ports = require('./ecosystem-ports.json');

if (process.env.ACTIVE_THEMES) {
  const active = process.env.ACTIVE_THEMES.split(',');
  ports = Object.entries(ports)
    .filter(([theme]) => active.includes(theme))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

let content = `apps:`;

if (Object.keys(ports).length === 1) {
  ports[Object.keys(ports)[0]] = process.env.PORT || 4200;
} else {
  content += `
  - script: dist/server.js
    name: distributor
    instances: ${process.env.CONCURRENCY_DISTRIBUTOR || 'max'}
    exec_mode: cluster
  `;
}

if (/^(on|1|true|yes)$/i.test(process.env.PROMETHEUS)) {
  content += `
  - script: dist/prometheus.js
    name: prometheus
`;
}

Object.entries(ports).forEach(([theme, port]) => {
  content += `
  - script: dist/${theme}/server/main.js
    name: ${theme}
    instances: ${process.env.CONCURRENCY_SSR || 2}
    exec_mode: cluster
    max_memory_restart: ${process.env.SSR_MAX_MEM || '400M'}
    env:
      BROWSER_FOLDER: dist/${theme}/browser
      PORT: ${port}
`;
});

fs.writeFileSync('dist/ecosystem.yml', content);
