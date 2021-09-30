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
        const allUp = Object.entries(ports)
          .map(([theme]) =>
            list
              .filter(el => el.name === theme)
              .find(el => el.pm2_env.status === 'online' || el.pm2_env.status === 'launching')
          )
          .reduce((acc, val) => acc && !!val, true);
        process.exit(allUp ? 0 : 1);
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
