// Does not work yet :()
// This is an EXPECTED use case
// https://github.com/hapijs/hapi/issues/2510
// https://github.com/hapijs/hapi/issues/3584

const fs = require('fs'),
  http2 = require('http2'),
  Hapi = require('hapi');

var server = new Hapi.Server();

const options = {
  key: fs.readFileSync('../keys/server.key'),
  cert: fs.readFileSync('../keys/server.crt'),
  ca: fs.readFileSync('../keys/server.csr')
};

server.connection({
   listener: http2.createServer(options),
   host: 'localhost',
   port: 3000,
   tls: true
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => reply('Hi, EmpireConf!')
})

server.start(err => {
  if (err) console.error(err)
  console.log('Server running at:', server.info.uri);
})
