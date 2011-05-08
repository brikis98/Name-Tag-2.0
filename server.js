var express = require('express'),
	dust = require('dust'),
	_ = require('underscore'),
	watcher = require('./watcher'),
	path = require('path'),
	PUBLIC_DIR = './public';

watcher.watch(dust, './templates', path.join(PUBLIC_DIR, 'js'), '.html');

var app = express.createServer();
app.use(express.static(path.join(__dirname, PUBLIC_DIR)));
app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

app.get('/', function(req, res){
  dust.render('index', {}, function(err, out) {
  	res.send(err ? err : out);
  });
});

app.listen(3000);