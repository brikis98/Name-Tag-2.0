NameTag.NameTagView = Backbone.View.extend
  initialize: (options) ->
    _.bindAll this, 'print', 'statusClicked', 'statusBlur', 'done', 'createDustBase', 'getDoneOverlay', 'shortenUrl', 'getFullContext', 'getCustomizeContext', 'renderShow', 'renderCustomize', 'updateCustomize', 'eventOptionsChanged', 'parse', 'toggleLogout', 'renderWithCallback', 'render'
                
    @logoutContainer = '#logout-container'
    @loginContainer = '#login-container'
    @badgeContainer = '#badge'
    @doneContainer = '#done-contents'
    @optionsForm = '#options-form'
    @statusContainer = '#status-text'
    @uploadContainer = '#upload'
    
    @profileModel = options.profileModel
    @eventModel = options.eventModel 
  
  events:
    'change input.event-options':     'eventOptionsChanged'
    'keyup input.event-options':      'eventOptionsChanged'
    'click .blue-button':             'done'
    'click #print a':                 'print'
    'click #status-text':             'statusClicked'
    'blur #status-text':              'statusBlur'

  print: (event) ->
    event.preventDefault()
    
    # Super hacky "print" window.    
    printWindow = window.open '', 'Print Name Tag | Name Tag 2.0', 'height=550, width=500, scrollbars=1'
    printDocument = printWindow.document
    options =
      hidePrint: true
      hideStatusInput: true
      hasStatus: !$(@statusContainer).hasClass('empty')
      status: $(@statusContainer).val() 

    @renderWithCallback 'badge', _.extend({}, @getFullContext(), options), (out) =>
      printDocument.write "<html><head><link href=\"/css/application.css\" rel=\"stylesheet\" type=\"text/css\"/></head><body>#{out}</body></html>"
      printDocument.close()
  
  statusClicked: (event) ->
    textArea = $(event.target)
    if textArea.hasClass 'empty'
      textArea.val ''
      textArea.removeClass 'empty'
  
  statusBlur: (event) ->
    textArea = $(event.target)
    if textArea.val() == ''
      textArea.val 'Enter a status'
      textArea.addClass 'empty'
  
  done: ->
    @getDoneOverlay().overlay().load()
  
  createDustBase: ->
    dust.makeBase
      loop: (chunk, context, bodies, params) ->
        list = context.current()
        start = params.start || 0
        end = params.end || list.length

        start = 0 if start < 0
        end = list.length if end > list.length

        chunk.render bodies.block, context.rebase(list[i]) for i in [start...end]
        chunk

      equals: (chunk, context, bodies, params) ->
        value = context.current()
        chunk.render bodies.block, context if value == params.value
        chunk
  
  getDoneOverlay: ->
    if !@doneOverlay
      @doneOverlay = $('#done-overlay').overlay
        mask:
          color: '#ebecff'
          loadSpeed: 200
          opacity: 0.9
        oneInstance: false
        onBeforeLoad: =>
          @shortenUrl "http://#{window.location.host}#show/#{@eventModel.url()}", (shortUrl) =>
            @render 'done', {showUrl: shortUrl}, @doneContainer
    @doneOverlay
  
  shortenUrl: (url, callback) ->
    $.get '/shorten', {url: url}, callback
  
  getFullContext: ->
    _.extend {}, @profileModel.attributes, @eventModel.attributes
  
  getCustomizeContext: ->
    _.extend {}, @getFullContext(), {hidePrint: true}
  
  renderCustomize: ->
    @eventModel.unbind 'change'
    @eventModel.bind 'change', @updateCustomize
    @render 'customize', @getCustomizeContext(), @el, =>
      @uploader ?= new qq.FileUploader
        element: $(@uploadContainer).get(0)
        action: '/upload'
        allowedExtensions: ['jpg', 'jpeg', 'png', 'gif']
        params: {id: @profileModel.get('id')}
        onComplete: (id, fileName, responseJSON) =>
          @eventModel.set(eventLogo: "http://#{window.location.host}#{responseJSON.url}") if responseJSON.success
  
  renderShow: ->
    @eventModel.unbind 'change'
    @render 'badge', @getFullContext()
  
  eventOptionsChanged: (event) ->
    values = $(this.optionsForm).serializeObject()
    @eventModel.set values
  
  updateCustomize: ->
    @controller.saveLocation "#customize/#{this.eventModel.url()}"
    $(@optionsForm).populate @eventModel.attributes
    @render 'badge', @getCustomizeContext(), @badgeContainer
  
  parse: (container = @loginContainer) ->
    IN.parse $(container).get(0)
  
  toggleLogout: ->
    if @profileModel.isEmpty()
      $(@logoutContainer).empty()
    else
      @render 'logout', @profileModel.attributes, @logoutContainer
  
  renderWithCallback: (template = 'landing', context = {}, callback) ->
    context = @createDustBase().push context
    dust.render template, context, (err, out) =>
      callback if err then err else out
  
  render: (template, context, container = @el, callback) ->
    @renderWithCallback template, context, (out) =>
      $(container).html out
      callback?()