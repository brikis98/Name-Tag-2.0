var express = require('express'),
	dust = require('dust'),
	_ = require('underscore'),
	watcher = require('./watcher'),
	path = require('path'),
	PUBLIC_DIR = './public',
	APP_DIR = './app';

var app = express.createServer();

app.configure(function() {
  app.use(express.static(path.join(__dirname, PUBLIC_DIR)));  
});
app.configure('development', function() {
  watcher.watch(dust, path.join(APP_DIR, 'templates'), path.join(APP_DIR, 'templates-compiled'), '.html', true);
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));  
});
app.configure('production', function() {
  watcher.watch(dust, path.join(APP_DIR, 'templates'), path.join(APP_DIR, 'templates-compiled'), '.html', false);
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  dust.render('index', {}, function(err, out) {
  	res.send(err ? err : out);
  });
});

app.listen(3000);