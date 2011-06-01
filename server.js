(function() {
  var Settings, Watcher, app, cleanupRequestedPath, dust, express, fs, path, restler, settings, uploadError, uploadSuccess, watcher, _;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  express = require('express');
  fs = require('fs');
  path = require('path');
  _ = require('underscore');
  dust = require('dust');
  Watcher = require('./util/watcher').watcher;
  Settings = require('settings');
  restler = require('restler');
  settings = new Settings(path.join(__dirname, 'config/environment.js')).getEnvironment();
  watcher = new Watcher(settings.watcherOptions, dust);
  watcher.compileTemplates();
  app = express.createServer();
  app.configure(function() {
    return app.use(express.bodyParser());
  });
  app.configure('development', function() {
    app.use(express.static(settings.publicDir));
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
    return watcher.watch();
  });
  app.configure('production', function() {
    app.use(express.static(settings.publicDir, {
      maxAge: settings.staticMaxAge
    }));
    return app.use(express.errorHandler());
  });
  app.get('/', function(req, res) {
    return dust.render('index', {}, __bind(function(err, out) {
      return res.send(err ? err : out);
    }, this));
  });
  app.get('/uploaded/:image', function(req, res) {
    return res.sendfile(path.join(settings.uploadDir, cleanupRequestedPath(req.params.image)));
  });
  app.post('/upload', function(req, res) {
    var fileData, fileName;
    if (!req.xhr) {
      return uploadError(res, 'Your browser is not supported.');
    }
    req.setEncoding('binary');
    fileName = cleanupRequestedPath("" + req.query.id + "-" + req.query.qqfile);
    fileData = '';
    req.on('data', function(data) {
      return fileData += data;
    });
    return req.on('end', function() {
      if (fileData.length > 10000) {
        return uploadError(res, 'Max file size is 10KB.');
      }
      return fs.writeFile(path.join(settings.uploadDir, fileName), fileData, 'binary', function(err) {
        if (err) {
          return uploadError(res, err);
        } else {
          return uploadSuccess(res, fileName);
        }
      });
    });
  });
  app.get('/shorten', function(req, res) {
    var request;
    request = restler.post('https://www.googleapis.com/urlshortener/v1/url', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        longUrl: unescape(req.query.url)
      })
    });
    request.on('success', function(data) {
      console.log('success');
      res.send(data.id);
    });
    request.on('error', function(data) {
      console.log('error');
      res.send(data);
    });
  });
  cleanupRequestedPath = function(file) {
    return path.basename(unescape(file));
  };
  uploadError = function(res, err) {
    return res.send({
      error: "Upload error: " + err
    });
  };
  uploadSuccess = function(res, fileName) {
    return res.send({
      success: true,
      url: "/uploaded/" + fileName
    });
  };
  app.listen(8003);
}).call(this);
