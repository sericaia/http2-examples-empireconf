const http2 = require('http2'),
  fs = require('fs'),
  url = require('url'),
  path = require('path');

const { HTTP2_HEADER_PATH } = http2.constants;

const options = {
  key: fs.readFileSync('../keys/server.key'),
  cert: fs.readFileSync('../keys/server.crt')
};

const pushAsset = (stream, file) => {
  const filePath = path.join(__dirname, file.filePath);
  stream.pushStream({ [HTTP2_HEADER_PATH]: file.path }, (pushStream) => {
    console.log(">> Pushing:", file.path);
    pushStream.respondWithFile(filePath, file.headers);
  });
}

const onRequestHandler = (req, res) => {
  const currentUrl = url.parse(req.url);
  const knownPaths = ['/'];

  console.log(">> Request:: method:", req.method, " path:", currentUrl.pathname);

  if(!currentUrl || !knownPaths.includes(currentUrl.pathname)) {
    res.writeHead(404);
    res.end('This is a 404!');
    return;
  }

  if (currentUrl.pathname === '/') {
    const cssFile = {
      path: '/style.css',
      filePath: './style.css',
      headers: {
        'content-type': 'text/css'
      }
    };
    pushAsset(res.stream, cssFile);

    res.stream.respond({
      'content-type': 'text/html',
      ':status': 200
    });
    res.stream.end(`
      <html>
        <head>
          <link rel='stylesheet' type='text/css' href='/style.css'>
        </head>
        <body>
          <h1 class='myHelloClass'>Hi, EmpireConf!</h1>
        </body>
      <html>`
    );
  }
}

const server = http2
  .createSecureServer(options, onRequestHandler)
  .listen(3000);
