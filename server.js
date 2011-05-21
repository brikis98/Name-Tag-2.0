var express = require('express'),
	dust = require('dust'),
	_ = require('underscore'),
	watcher = require('./watcher'),
	path = require('path'),
	fs = require('fs'),
	rest = require('restler'),
	PUBLIC_DIR = './public',
	UPLOAD_DIR = './mnt',
	APP_DIR = './app';

var app = express.createServer();

app.configure(function() {
  app.use(express.static(path.join(__dirname, PUBLIC_DIR)));  
  app.use(express.bodyParser());
});
app.configure('development', function() {
  watcher.watch(dust, path.join(APP_DIR, 'templates'), path.join(APP_DIR, 'templates-compiled'), '.html', true);
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));  
});
app.configure('production', function() {
  watcher.watch(dust, path.join(APP_DIR, 'templates'), path.join(APP_DIR, 'templates-compiled'), '.html', false);
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  dust.render('index', {}, function(err, out) {
  	res.send(err ? err : out);
  });
});

app.get('/images/:image', function(req, res) {
  res.sendfile(path.join(UPLOAD_DIR, cleanupRequestedPath(req.params.image)));
});

app.post('/upload', function(req, res) {
  var fileName, data;
  if (req.xhr) {
    var fileName = cleanupRequestedPath(req.header('x-file-name'));
    var writeStream = fs.createWriteStream(path.join(UPLOAD_DIR, fileName));
    req.on('data', function(data) { 
      writeStream.write(data);
    });
    req.on('end', function() {
      writeStream.end();
      uploadSuccess(res, fileName);
    });
  } else {
    res.send({error: 'Your browser is not supported.'});
  }
});

app.get('/shorten', function(req, res) {
  rest.post('https://www.googleapis.com/urlshortener/v1/url', {
    headers: {'Content-Type': 'application/json'}, 
    data: JSON.stringify({longUrl: unescape(req.query.url)})
  }).on('success', function(data) {
    res.send(data.id);
  }).on('error', function(err) {
    res.send(err);
  });
});

function cleanupRequestedPath(file) {
  return path.basename(unescape(file));
}

function uploadSuccess(res, fileName) {
  res.send({success: true, url: '/images/' + fileName});
}

app.listen(3000);