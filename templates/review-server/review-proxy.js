const { exec } = require('child_process');
var express = require('express');
var app = express();

app.get('/*', function (req, res) {
  const name = req.url.substr(1).replace(/\/.*/g, '');
  const path = req.url.replace(/^\/[^\/]*/, '');

  if (name) {
    exec(`docker inspect ${name}`, (err, stdout) => {
      if (err) {
        // node couldn't execute the command
        return res.status(500).send(err);
      }

      let inspect;
      try {
        inspect = JSON.parse(stdout);
      } catch (erro) {
        return res.status(500).send({ error: erro });
      }
      if (!inspect) {
        return res.status(500).send({ error: 'no data from inspect' });
      }

      const ports = inspect[0].NetworkSettings.Ports;
      const bindings = Object.keys(ports)
        .filter(val => !!val && !!ports[val])
        .filter(val => !val.includes('443'))
        .map(key => ports[key])
        .reduce((acc, val) => [...acc, ...val], [])
        .map(binding => binding.HostPort)
        .map(parseInt);

      console.log(name, ports);
      if (!bindings || !bindings.length) {
        return res.status(404).send({ error: 'instance does not have public ports' });
      }

      const host = req.headers.host.replace(/:.*/g, '');
      const to = 'http://' + host + ':' + bindings[0] + path;

      console.log(name, 'redirecting to', to);
      return res.redirect(to);
    });
  } else {
    exec(`docker ps --format "{{.Names}}"`, (err, stdout) => {
      if (err) {
        // node couldn't execute the command
        return res.status(500).send(err);
      }

      let names;
      try {
        names = stdout.split('\n');
      } catch (erro) {
        return res.status(500).send({ error: erro });
      }
      if (!names) {
        return res.status(500).send({ error: 'no data from inspect' });
      }
      const list = names
        .filter(name => !!name && !!name.trim())
        .sort()
        .map(name => '<li><a href="http://' + req.headers.host + '/' + name + '">' + name + '</a></li>')
        .join('');
      return res.send('<html><ul>' + list + '</ul></html>');
    });
  }
});

app.listen(3000, function () {
  console.log('app listening');
});
