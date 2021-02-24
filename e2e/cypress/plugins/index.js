module.exports = on => {
  on('task', {
    failed: require('cypress-failed-log/src/failed')(),
  });
  require('cypress-log-to-output').install(on);
};
