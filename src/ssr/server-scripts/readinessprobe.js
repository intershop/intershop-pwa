function formatBytes(bytes) {
  const regex = /(\d+)([a-zA-Z])/m;
  [, number, size] = bytes.match(regex);

  const k = 1000;
  const sizes = ['B', 'K', 'M', 'G'];

  const i = sizes.findIndex(el => el === size);

  return parseFloat(parseFloat(number) * Math.pow(k, i));
}

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
        let tooMuchMemoryCounter = 0;
        Object.entries(ports).forEach(([theme]) => {
          list
            .filter(el => el.name === theme)
            .filter(
              el =>
                el.monit?.memory >=
                (process.env.MAX_MEMORY_READY ? formatBytes(process.env.MAX_MEMORY_READY) : formatBytes('400M'))
            )
            .map(() => tooMuchMemoryCounter++);
        });
        tooMuchMemoryCounter != 0 ? process.exit(1) : process.exit(0);
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
