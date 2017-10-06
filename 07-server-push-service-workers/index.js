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
  const knownPaths = ['/', '/sw.js'];

  console.log(">> Request:: method:", req.method, " path:", currentUrl.pathname);

  if(!currentUrl || !knownPaths.includes(currentUrl.pathname)) {
    res.writeHead(404);
    res.end('This is a 404!');
    return;
  }

  if (currentUrl.pathname === '/') {
    const cssFile = {
      path: '/style.css',
      filePath: './assets/style.css',
      headers: {
        'content-type': 'text/css',
        'cache-control': 'max-age=300'
      }
    };
    pushAsset(res.stream, cssFile);

    const jsFile = {
      path: '/app.js',
      filePath: './public/app.js',
      headers: {
        'content-type': 'application/javascript',
        'cache-control': 'max-age=300'
      }
    };
    pushAsset(res.stream, jsFile);

    res.stream.respondWithFile('./public/index.html', {
      'content-type': 'text/html',
      'cache-control': 'max-age=300'
    });
  }

  if (currentUrl.pathname === '/sw.js') {
    res.writeHead(200, {
      'content-type': 'application/javascript'
    });
    const filePath = path.join(__dirname, req.url);
    return fs.createReadStream(filePath).pipe(res);
  }
}

const server = http2
  .createSecureServer(options, onRequestHandler)
  .listen(3000);
