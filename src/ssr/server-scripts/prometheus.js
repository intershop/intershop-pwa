const { readFileSync } = require('fs');
const { join } = require('path');

const express = require('express');
const pm2 = require('pm2');
const client = require('prom-client');

const ports = JSON.parse(readFileSync(join(__dirname, 'ecosystem-ports.json'), { encoding: 'utf-8' }));
const metricsPerWorker = {};
const restartState = {};

const up = new client.Gauge({
  name: 'up',
  help: '1 = up, 0 = not up',
});
const pm2SSRMemoryLimit = new client.Gauge({
  name: 'pm2_ssr_memory_limit',
  help: 'SSR memory limit',
});
const pm2Processes = new client.Gauge({
  name: 'pm2_processes',
  help: 'PM2 process count',
  labelNames: ['name'],
});
const pm2ProcessRestarts = new client.Counter({
  name: 'pm2_process_restarts',
  help: 'PM2 process restart count',
  labelNames: ['name'],
});
const pm2Memory = new client.Gauge({
  name: 'pm2_memory',
  help: 'PM2 process memory',
  labelNames: ['name', 'pm2_id'],
});
const pm2GetMetricsSuccess = new client.Counter({
  name: 'pm2_getmetrics_success',
  help: 'Successful getMetrics messages',
});
const pm2GetMetricsFailure = new client.Counter({
  name: 'pm2_getmetrics_failure',
  help: 'Failed getMetrics messages',
});

up.set({}, 1);

const app = express();

app.get('/metrics', (_, res) => {
  collectPM2Metrics();

  const metrics = Object.values(metricsPerWorker);
  client.register
    .getMetricsAsJSON()
    .then(pm2Metrics => {
      metrics.push(pm2Metrics);
      return client.AggregatorRegistry.aggregate(metrics).metrics();
    })
    .then(content => {
      res.set('Content-Type', client.contentType);
      res.send(content);
    })
    .catch(error => res.status(500).send(error.toString()));
});

app.listen(9113, () => {
  process.send?.('ready');
  console.log('Prometheus reporter listening');
});

pm2.launchBus((error, bus) => {
  if (error) {
    console.error(error);
    return;
  }

  bus.on('process:msg', message => {
    if (message?.data?.topic === 'returnMetrics' && message.process.name && message.process.pm_id) {
      metricsPerWorker[`${message.process.name} ${message.process.pm_id}`] = message.data.body;
    }
  });
});

function collectPM2Metrics() {
  pm2.connect(connectError => {
    if (connectError) return;

    pm2.list((listError, processes) => {
      if (listError) return;

      processes
        .filter(processData => ports[processData.name])
        .forEach(processData => {
          pm2.sendDataToProcessId(
            processData.pm_id,
            {
              id: processData.pm_id,
              type: 'process:msg',
              data: {},
              topic: 'getMetrics',
            },
            error => (error ? pm2GetMetricsFailure.inc() : pm2GetMetricsSuccess.inc())
          );
        });

      const processCounts = processes.reduce(
        (counts, processData) => ({
          ...counts,
          [processData.name]: (counts[processData.name] || 0) + 1,
        }),
        {}
      );
      Object.entries(processCounts).forEach(([name, count]) => pm2Processes.labels({ name }).set(count));

      processes.forEach(({ name, pm_id: pm2Id, monit }) => {
        pm2Memory.labels({ name, pm2_id: pm2Id }).set(monit?.memory || 0);
      });

      const maxMemory = processes.map(processData => processData.pm2_env.max_memory_restart).find(Boolean);
      if (maxMemory) pm2SSRMemoryLimit.set(maxMemory);

      const restartCounts = processes.reduce(
        (counts, processData) => ({
          ...counts,
          [processData.name]: (counts[processData.name] || 0) + (processData.pm2_env.restart_time || 0),
        }),
        {}
      );
      Object.entries(restartCounts).forEach(([name, count]) => {
        const previousCount = restartState[name] || 0;
        restartState[name] = count;
        pm2ProcessRestarts.labels({ name }).inc(Math.max(0, count - previousCount));
      });
    });
  });
}
