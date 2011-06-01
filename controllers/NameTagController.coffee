NameTag.NameTagController = Backbone.Controller.extend
  initialize: (options) ->
    _.bindAll this, 'index', 'routeToCustomize', 'renderWithProfile', 'ensureLogin', 'nameTag', 'logout', 'onLinkedInLoad', 'onLinkedInAuth'
        
    _.extend this, Backbone.Events    
    
    @view = options.view
    @view.controller = this
    
    @profileModel = options.profileModel
    @eventModel = options.eventModel
    
    @route "customize/#{@eventModel.getRoutePattern()}", 'customize', =>
      @nameTag arguments, @view.renderCustomize

    @route "show/#{@eventModel.getRoutePattern()}", 'show', =>
      @nameTag arguments, @view.renderShow
    
    @profileModel.bind 'change', @view.toggleLogout
  
  routes:
    '':                                                      'index'              
    'customize':                                             'routeToCustomize'   
    'logout':                                                'logout'             
  
  index: ->
    @view.render()
  
  routeToCustomize: ->
    window.location.hash = "#customize/#{@eventModel.url()}"
  
  renderWithProfile: (callback) ->
    if @profileModel.isEmpty()
      @profileModel.bind 'change', _.once(callback)
    else
      callback()
  
  ensureLogin: (callback) ->
    if IN? && IN.User
      if IN.User.isAuthorized()
        callback()              
      else
        IN.Event.on IN, 'auth', callback
        @view.render 'login'
        @view.parse @view.el
    else
      @bind 'onLinkedInLoad', => 
        @ensureLogin callback
  
  nameTag: (args, renderCallback) ->
    @eventModel.update args
    @ensureLogin () =>
      @renderWithProfile renderCallback
  
  logout: ->
    @profileModel.clear()
    window.location.hash = ''
  
  onLinkedInLoad: ->
    @view.parse()
    @trigger 'onLinkedInLoad'
    IN.Event.on IN, 'auth', @onLinkedInAuth
  
  onLinkedInAuth: ->
    @profileModel.fetch()