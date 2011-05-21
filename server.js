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
  if (req.xhr) {
    var fileName = cleanupRequestedPath(req.header('x-file-name'));
    var fileData = '';
    req.on('data', function(data) { 
      fileData += data;
    });
    req.on('end', function() {
      if (fileData.length > 10000) { 
        uploadError(res, 'Max file size is 10KB.');        
      } else {
        fs.writeFile(path.join(UPLOAD_DIR, fileName), fileData, 'binary', function(err) {
          if (err) {
            uploadError(res, err);
          } else {
            uploadSuccess(res, fileName);                              
          }
        });
      }     
    });
  } else {
    uploadError(res, 'Your browser is not supported.');
  }
});

app.get('/shorten', function(req, res) {
  // TODO: get goo.gl API key so ou don't get throttled too quickly
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

function uploadError(res, err) {
  res.send({error: 'Upload error: ' + err});
}

function uploadSuccess(res, fileName) {
  res.send({success: true, url: '/images/' + fileName});
}

app.listen(3000);