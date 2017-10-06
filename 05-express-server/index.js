// does not work yet :()
// This is an EXPECTED use case
// https://github.com/expressjs/express/issues/3388
// https://github.com/expressjs/express/pull/3390
// https://github.com/nodejs/node/issues/15203

const fs = require('fs'),
  http2 = require('http2'),
  express = require('express')
  app = express();

const options = {
  key: fs.readFileSync('../keys/server.key'),
  cert: fs.readFileSync('../keys/server.crt'),
  ca: fs.readFileSync('../keys/server.csr')
};

app.get('/', function (request, response) {
  request.send('Hi, EmpireConf!');
});

const server = http2.createSecureServer(options, app);

server.listen(3000, () => {
  console.log('Server running at:', this.address().port);
});
