const express = require('express');
const pm2 = require('pm2');
const ports = require('./ecosystem-ports.json');
const DEBUG = /^(on|1|true|yes)$/i.test(process.env.DEBUG);

const client = require('prom-client');
const metricsPerWorker = {};
const requestCounts = new client.Gauge({
  name: 'http_request_counts',
  help: 'counter for requests labeled with: method, status_code, theme, base_href, path',
  labelNames: ['method', 'status_code', 'theme', 'base_href', 'path'],
});
const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'duration histogram of http responses labeled with: status_code, theme',
  buckets: [0.1, 0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30],
  labelNames: ['status_code', 'theme', 'base_href', 'path'],
});
const up = new client.Gauge({
  name: 'up',
  help: '1 = up, 0 = not up',
});
up.set({}, 1);
const pm2Processes = new client.Gauge({
  name: 'pm2_processes',
  help: 'counter for pm2 processes',
  labelNames: ['name'],
});
const pm2ProcessRestarts = new client.Gauge({
  name: 'pm2_process_restarts',
  help: 'counter for pm2 process restarts',
  labelNames: ['name'],
});
const pm2Memory = new client.Gauge({
  name: 'pm2_memory',
  help: 'counter for pm2 memory',
  labelNames: ['name'],
});
const pm2GetmetricsSuccess = new client.Counter({
  name: 'pm2_getmetrics_success',
  help: 'counter for successful getmetrics messages',
});
const pm2GetmetricsFailure = new client.Counter({
  name: 'pm2_getmetrics_failure',
  help: 'counter for unsuccessful getmetrics messages',
});

const app = express();

app.post('/report', (req, res) => {
  req.on('data', data => {
    if (DEBUG) {
      console.log(data.toString());
    }
    const json = JSON.parse(data);
    const { method, status: status_code, duration, theme, url } = json;
    const matched = /;baseHref=([^;?]*)/.exec(url);
    let base_href = matched?.[1] ? decodeURIComponent(decodeURIComponent(matched[1])) + '/' : '/';
    let cleanUrl = url.replace(/[;?].*/g, '');
    let path = cleanUrl.replace(base_href, '');

    requestCounts.inc({ method, status_code, theme, base_href, path });
    requestDuration.labels({ status_code, theme, base_href, path }).observe(duration / 1000);
  });
  res.status(204).send();
});

app.get('/metrics', (_, res) => {
  const metricsArr = Object.values(metricsPerWorker);
  client.register
    .getMetricsAsJSON()
    .then(pm2Metrics => {
      metricsArr.push(pm2Metrics);
      const registry = client.AggregatorRegistry.aggregate(metricsArr);
      registry
        .metrics()
        .then(content => {
          res.set('Content-Type', client.contentType);
          res.send(content);
        })
        .catch(error => {
          res.status(500).send(error.toString());
        });
    })
    .catch(error => {
      res.status(500).send(error.toString());
    });

  pm2.connect(err1 => {
    if (!err1) {
      pm2.list((err2, list) => {
        if (!err2) {
          const pm2ProcessCounts = list.reduce((acc, p) => ({ ...acc, [p.name]: (acc[p.name] || 0) + 1 }), {});
          Object.entries(pm2ProcessCounts).forEach(([name, value]) => {
            pm2Processes.labels({ name }).set(value);
          });
          const pm2ProcessMemory = list.reduce(
            (acc, p) => ({ ...acc, [p.name]: (acc[p.name] || 0) + p.monit?.memory || 0 }),
            {}
          );
          Object.entries(pm2ProcessMemory).forEach(([name, value]) => {
            pm2Memory.labels({ name }).set(value);
          });
          const pm2Restarts = list.reduce(
            (acc, p) => ({ ...acc, [p.name]: (acc[p.name] || 0) + p.pm2_env.restart_time || 0 }),
            {}
          );
          Object.entries(pm2Restarts).forEach(([name, value]) => {
            pm2ProcessRestarts.labels({ name }).set(value);
          });
        }
      });
    }
  });
});

app.listen(9113, () => {
  process.send('ready');
  console.log('Prometheus reporter listening');
});

// Ask other processes for metrics Every 10 seconds
const getMetricsInterval = setInterval(() => {
  pm2.connect(() => {
    Object.keys(ports).forEach(theme => {
      pm2.describe(theme, (err, processInfo) => {
        processInfo.forEach((processData, index) => {
          //console.log(`Asking process ${processData.pm_id} for metrics.`);

          pm2.sendDataToProcessId(
            processData.pm_id,
            {
              id: processData.pm_id,
              type: 'process:msg',
              data: {
                theme: processData.name,
                instance: index,
              },
              topic: 'getMetrics',
            },
            (err, res) => {
              if (err) {
                console.error(error);
                pm2GetmetricsFailure.inc();
              } else {
                pm2GetmetricsSuccess.inc();
              }
            }
          );
        });
      });
    });
  });
}, 1000);

// Listen to messages from theme applications
pm2.launchBus(function (err, pm2_bus) {
  pm2_bus.on('process:msg', msg => {
    if (msg?.data?.topic == 'returnMetrics' && msg.process.name && msg.process.pm_id) {
      const worker = `${msg.process.name} ${msg.process.pm_id}`;
      metricsPerWorker[worker] = msg.data.body;
    }
  });
});
