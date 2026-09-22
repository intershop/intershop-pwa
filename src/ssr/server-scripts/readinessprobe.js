const pm2 = require('pm2');
let ports = require('./ecosystem-ports.json');

if (process.env.ACTIVE_THEMES) {
  const activeThemes = process.env.ACTIVE_THEMES.split(',').map(theme => theme.trim());
  ports = Object.fromEntries(Object.entries(ports).filter(([theme]) => activeThemes.includes(theme)));
}

const themes = Object.keys(ports);
const requiredApps = themes.length > 1 ? ['distributor', ...themes] : themes;

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

    const unreadyApps = requiredApps.filter(
      app => !processes.some(proc => proc.name === app && proc.pm2_env.status === 'online')
    );
    if (unreadyApps.length) {
      console.error(`PM2 apps not ready: ${unreadyApps.join(', ')}`);
      process.exit(1);
    }
    process.exit(0);
  });
});
