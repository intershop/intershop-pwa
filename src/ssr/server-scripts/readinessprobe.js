const pm2 = require('pm2');
let ports = require('./ecosystem-ports.json');

if (process.env.ACTIVE_THEMES) {
  const active = process.env.ACTIVE_THEMES.split(',');
  ports = Object.entries(ports)
    .filter(([theme]) => active.includes(theme))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}

pm2.connect(err1 => {
  if (!err1) {
    pm2.list((err2, list) => {
      if (!err2) {
        // Ready only when every theme process is actually serving ('online'), not merely
        // registered or still 'launching' — otherwise traffic is routed before SSR can serve.
        const allReady = Object.entries(ports)
          .map(([theme]) => list.find(el => el.name === theme && el.pm2_env.status === 'online'))
          .reduce((acc, val) => acc && !!val, true);
        process.exit(allReady ? 0 : 1);
      } else {
        console.log('pm2 list error:', err2);
        process.exit(1);
      }
    });
  } else {
    console.log('pm2 connection error:', err1);
    process.exit(1);
  }
});
