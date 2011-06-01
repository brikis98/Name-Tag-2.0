express    = require 'express'
fs         = require 'fs'
path       = require 'path'
_          = require 'underscore'
dust       = require 'dust'
Watcher    = require('./util/watcher').watcher
Settings   = require 'settings'
restler    = require 'restler'

settings       = new Settings(path.join __dirname, 'config/environment.js').getEnvironment()
watcher        = new Watcher settings.watcherOptions, dust

watcher.compileTemplates()

app = express.createServer()

app.configure ->
  app.use express.bodyParser()

app.configure 'development', ->
  app.use express.static(settings.publicDir)
  app.use express.errorHandler(dumpExceptions: true, showStack: true)
  watcher.watch()
  
app.configure 'production', ->
  app.use express.static(settings.publicDir, maxAge: settings.staticMaxAge)
  app.use express.errorHandler()

app.get '/', (req, res) ->
  dust.render 'index', {}, (err, out) =>
  	res.send if err then err else out
  
app.get '/uploaded/:image', (req, res) ->
  res.sendfile path.join(settings.uploadDir, cleanupRequestedPath(req.params.image))

app.post '/upload', (req, res) ->
  return uploadError res, 'Your browser is not supported.' if !req.xhr
    
  req.setEncoding 'binary'  
  fileName = cleanupRequestedPath "#{req.query.id}-#{req.query.qqfile}"

  fileData = ''  
  req.on 'data', (data) ->
    fileData += data;
  
  req.on 'end', () ->
    return uploadError res, 'Max file size is 10KB.' if fileData.length > 10000

    fs.writeFile path.join(settings.uploadDir, fileName), fileData, 'binary', (err) ->
      if err
        uploadError res, err
      else
        uploadSuccess res, fileName

app.get '/shorten', (req, res) ->
  # TODO: get goo.gl API key so ou don't get throttled too quickly
  request = restler.post 'https://www.googleapis.com/urlshortener/v1/url',
    headers: {'Content-Type': 'application/json'}  
    data: JSON.stringify({longUrl: unescape(req.query.url)})
  request.on 'success', (data) ->
    console.log 'success'
    res.send data.id
  request.on 'error', (data) ->
    console.log 'error'
    res.send data

cleanupRequestedPath = (file) ->
  path.basename unescape(file)

uploadError = (res, err) ->
  res.send error: "Upload error: #{err}"

uploadSuccess = (res, fileName) ->
  res.send success: true, url: "/uploaded/#{fileName}"

app.listen 8003