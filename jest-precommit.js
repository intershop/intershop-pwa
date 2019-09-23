var exec = require('child_process').exec;
exec('ng test --ci --bail -io --noStackTrace', function callback(error, stdout, stderr) {
  console.log(stdout);
  console.log(stderr);

  if (error) {
    console.log(error);
    process.exit(1);
  }
});
