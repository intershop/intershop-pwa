function memoryLimit() {
  const regex = /(\d+)([a-zA-Z])/m;
  [, max, size] = (process.env.SSR_MAX_MEM || '400M').match(regex);

  const limit = parseFloat(process.env.MEM_READY_LIMIT) || 0.8;

  const k = 1000;
  const sizes = ['B', 'K', 'M', 'G'];

  const i = sizes.findIndex(el => el === size);

  return parseFloat(parseFloat(limit * max) * Math.pow(k, i));
}

const pm2 = require('pm2');
let ports = require('./ecosystem-ports.json');

const limit = memoryLimit();

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
        let memoryExceeds = 0;
        Object.entries(ports).map(
          ([theme]) =>
            (memoryExceeds += list.filter(el => el.name === theme).filter(el => el.monit?.memory >= limit).length)
        );
        process.exit(memoryExceeds > 0 ? 1 : 0);
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
