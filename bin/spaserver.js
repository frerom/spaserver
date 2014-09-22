#! /usr/bin/env node
var args = require('minimist')(process.argv.slice(2), {
      default: { port: 4040, default: 'index.html' },
      alias: { port: ['p'], default: ['d'], help: ['h'] },
      booleans: 'help'
    }),
    http = require('http'),
    path = require('path'),
    url = require('url'),
    fs = require('fs'),
    port = args.port,
    home = process.cwd(),
    defaultFile = path.join(home, args.default),
    mimeTypes = {
      "html": "text/html",
      "jpeg": "image/jpeg",
      "jpg": "image/jpeg",
      "png": "image/png",
      "js": "text/javascript",
      "css": "text/css"
    };
if (args.help) {
  console.log('Usage: spaserver [options]');
  console.log('\nOptions:');
  console.log('-p, --port \tPort to listen to. Defaults to 4040');
  console.log('-d, --default \tDefault file to return. Defaults to index.html');
  return;
}

if (!fs.existsSync(defaultFile)) {
  console.log('Default path "%s" does not exist', defaultFile);
  return;
}

http.createServer(function (req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(home, uri);
  fs.stat(filename, function(err, stat) {
    if (err || !stat.isFile()) {
      filename = defaultFile;    
    }
    console.log('%s -> %s', req.url, filename.replace(home, '.'));
    var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
    res.writeHead(200, mimeType);

    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
  });
}).listen(port);
console.log('Listening on port', port);
