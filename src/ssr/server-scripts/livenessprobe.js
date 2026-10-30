const pm2 = require('pm2');
let ports = require('./ecosystem-ports.json');

if (process.env.ACTIVE_THEMES) {
  const activeThemes = process.env.ACTIVE_THEMES.split(',').map(theme => theme.trim());
  ports = Object.fromEntries(Object.entries(ports).filter(([theme]) => activeThemes.includes(theme)));
}

const themes = Object.keys(ports);
const requiredApps = themes.length > 1 ? ['distributor', ...themes] : themes;
const aliveStatuses = ['online', 'launching'];

pm2.connect(connectError => {
  if (connectError) {
    console.error('pm2 connection error:', connectError);
    process.exit(1);
  }

  pm2.list((listError, processes) => {
    if (listError) {
      console.error('pm2 list error:', listError);
      process.exit(1);
    }

    const deadApps = requiredApps.filter(
      app => !processes.some(proc => proc.name === app && aliveStatuses.includes(proc.pm2_env.status))
    );
    if (deadApps.length) {
      console.error(`PM2 apps not alive: ${deadApps.join(', ')}`);
      process.exit(1);
    }
    process.exit(0);
  });
});
