const http2 = require('http2');
const clientSession = http2.connect('http://localhost:3000');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS
} = http2.constants;

console.log('--- clientSession INIT')
console.log(clientSession)

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { console.log(chunk) });
  req.on('end', () => {
    console.log('ENDED lets shut down');
    clientSession.shutdown({
      graceful: true,
      opaqueData: Buffer.from('shut up and dance!')
    }, () => {
      console.log('--- clientSession SHUTDOWN') // shuttingDown is never true?!
      console.log(clientSession)
      clientSession.destroy();
      console.log('--- clientSession DESTROY')
      console.log(clientSession)
    });
  });
});
