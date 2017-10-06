const http2 = require('http2'),
fs = require('fs');

const options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt')
};

const server = http2.createSecureServer(options);
server.on('stream', (stream, requestHeaders) => {
  stream.respond();
  stream.end('Hi, EmpireConf!');
});
server.listen(3000);
