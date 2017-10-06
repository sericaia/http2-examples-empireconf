const http2 = require('http2');

console.log(http2)
// console.log(http2.getDefaultSettings())

const server = http2.createServer();
server.on('stream', (stream, requestHeaders) => {

  const p_init = http2.getPackedSettings()
  console.log(http2.getUnpackedSettings(p_init))
  const p = http2.getPackedSettings({ enablePush: false })
  console.log(http2.getUnpackedSettings(p))

  // console.log(stream)
  // stream.respond({ ':status': 200, 'content-type': 'text/plain' });
  // stream.write('hello ');
  // stream.end('world');
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hi, EmpireConf</h1>');
});
server.listen(3000);


// NOTE:: http2.getPackedSettings() // its actually a set, which is strange
