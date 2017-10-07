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

const handleIndex = (req, res) => {
  const cssFile = {
    path: '/style.css',
    filePath: './public/style.css',
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

  return res.stream.respondWithFile('./public/index.html', {
    'content-type': 'text/html',
    'cache-control': 'max-age=300'
  });
}

const handleSW = (req, res) => {
  res.writeHead(200, {
    'content-type': 'application/javascript'
  });
  const filePath = path.join(__dirname, req.url);
  return fs.createReadStream(filePath).pipe(res);
}

const handlePublic = (req, res) => {
  // TODO: verify if file exists in folder
  const filePath = path.join(__dirname, `/public/${req.url}`);
  return fs.createReadStream(filePath).pipe(res);
}

const onRequestHandler = (req, res) => {
  const currentUrl = url.parse(req.url);

  console.log(">> Request:: method:", req.method, " path:", currentUrl.pathname);

  if(!currentUrl) {
    res.writeHead(404);
    res.end('This is a 404!');
    return;
  }

  if (currentUrl.pathname === '/') {
    return handleIndex(req, res);
  }

  if (currentUrl.pathname === '/sw.js') {
    return handleSW(req, res);
  }

  return handlePublic(req, res);
}

const server = http2
  .createSecureServer(options, onRequestHandler)
  .listen(3000);
