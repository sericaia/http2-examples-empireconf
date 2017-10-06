const http2 = require('http2');
const clientSession = http2.connect('http://localhost:3000');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {

  // console.log(http2)
 console.log(clientSession.settings());

  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { console.log(chunk) });
  req.on('end', () => {
    console.log('End');
  });
});
