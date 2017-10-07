const http2 = require('http2'),
fs = require('fs');

const options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt')
};

const server = http2.createSecureServer(options);
server.on('stream', (stream, requestHeaders) => {
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hi, EmpireConf</h1>');
});
server.listen(3000);
