const http2 = require('http2'),
  fs = require('fs');

const options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt'),
  allowHTTP1: true
};

const onRequestHandler = (req, res) => {
  // console.log(req.socket.getPeerCertificate())

  // client support HTTP/2 ?
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;

  res.writeHead(200, { 'content-type': 'application/json' });
  // res.writeHead(200, 'this is a very good message', { 'content-type': 'application/json' }); // UnsupportedWarning: Status message is not supported by HTTP/2 (RFC7540 8.1.2.4)

  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion
  }));
}

const server = http2.createSecureServer(
  options,
  onRequestHandler
).listen(3000);
