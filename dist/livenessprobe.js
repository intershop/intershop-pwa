const pm2 = require('pm2');
let ports = require('./ecosystem-ports').ports;

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
        Object.entries(ports).forEach(([theme]) => {
          if (
            list
              .filter(el => el.name === theme)
              .find(el => el.pm2_env.status === 'online' || el.pm2_env.status === 'launching')
          ) {
            process.exit(0);
          }
        });
        process.exit(1);
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
