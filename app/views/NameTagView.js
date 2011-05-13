var NameTagView = Backbone.View.extend({
  initialize: function(options) {
    _.bindAll(this, 'render', 'parse', 'toggleLogout', 'eventOptionsChanged', 'getFullContext', 'renderCustomize', 'renderShow', 'done', 'getDoneOverlay', 'renderWithCallback', 'print', 'statusClicked', 'statusBlur', 'getCustomizeContext');
    
    this.logoutContainer = '#logout-container';        
    this.loginContainer = '#login-container';
    this.badgeContainer = '#badge';
    this.doneContainer = '#done-contents';
    this.optionsForm = '#options-form';
    this.statusContainer = '#status-text';
    
    this.profileModel = options.profileModel;
    this.eventModel = options.eventModel;    
  },
  
  events: {
    'change input.event-options':     'eventOptionsChanged',
    'keyup input.event-options':      'eventOptionsChanged',
    'click .blue-button':             'done',
    'click #print a':                 'print',
    'click #status-text':             'statusClicked',
    'blur #status-text':              'statusBlur'
  },

  print: function(event) {
    event.preventDefault();
    
    // Super hacky "print" window.    
    var printWindow = window.open('', 'Print Name Tag | Name Tag 2.0', 'height=550, width=500, scrollbars=1');
    var printDocument = printWindow.document;
    var options = {
      hidePrint: true,
      hideStatusInput: true,      
      hasStatus: !$(this.statusContainer).hasClass('empty'),
      status: $(this.statusContainer).val() 
    };
    this.renderWithCallback('badge', _.extend({}, this.getFullContext(), options), function(out) {
      printDocument.write('<html><head><link href="css/main.css" rel="stylesheet" type="text/css"/></head><body>' + out + '</body></html>');
      printDocument.close();
    });    
  },
  
  statusClicked: function(event) {
    var textArea = $(event.target);
    if (textArea.hasClass('empty')) {
      textArea.val('');
      textArea.removeClass('empty');
    }
  },
  
  statusBlur: function(event) {
    var textArea = $(event.target);
    if (textArea.val() == '') {
      textArea.val('Enter a status');
      textArea.addClass('empty');      
    }
  },
  
  createDustBase: function() {
    return dust.makeBase({
      loop: function(chunk, context, bodies, params) {
        var list = context.current();
        var start = params.start || 0;
        var end = params.end || list.length;
        
        if (start < 0) {
          start = 0;
        }
        if (end > list.length) {
          end = list.length;
        }
        
        for (var i = start; i < end; i++) {
          chunk.render(bodies.block, context.rebase(list[i]));
        }
        return chunk;
      },
      
      equals: function(chunk, context, bodies, params) {
        var value = context.current();
        if (value == params.value) {
          chunk.render(bodies.block, context);
        }
        return chunk;
      }
    });  
  },
  
  done: function() {
    this.getDoneOverlay().overlay().load();
  },
  
  getDoneOverlay: function() {
    var that = this;
    if (!this.doneOverlay) {
      this.doneOverlay = $('#done-overlay').overlay({
        mask: {
          color: '#ebecff',
          loadSpeed: 200,
          opacity: 0.9
        },
        oneInstance: false,
        onBeforeLoad: function() {
          that.shortenUrl('http://' + window.location.host + '#show/' + that.eventModel.url(), function(shortUrl) {
            that.render('done', {showUrl: shortUrl}, that.doneContainer);  
          });          
        }  
      });      
    }
    return this.doneOverlay;
  },
  
  shortenUrl: function(url, callback) {
    jsonlib.fetch({
      url: 'https://www.googleapis.com/urlshortener/v1/url', 
      header: 'Content-Type: application/json', 
      data: JSON.stringify({longUrl: url})
    }, function(response) {
      callback(JSON.parse(response.content).id);
    });
  },
  
  getFullContext: function() {
    return _.extend({}, this.profileModel.attributes, this.eventModel.attributes);
  },
  
  getCustomizeContext: function() {
    return _.extend({}, this.getFullContext(), {hidePrint: true});
  },
  
  renderCustomize: function() {
    this.render('customize', this.getCustomizeContext());
  },
  
  renderShow: function() {
    this.render('badge', this.getFullContext());
  },
  
  eventOptionsChanged: function(event) {
    var values = $(this.optionsForm).serializeObject();
    values.extended = values.extended == 'true';
    values.namePositionTop = values.namePositionTop == 'true'; 
    this.eventModel.set(values);
    this.controller.saveLocation('#customize/' + this.eventModel.url());
    this.render('badge', this.getCustomizeContext(), this.badgeContainer);
  },
  
  parse: function(container) {
    container = container || this.loginContainer;
    IN.parse($(container).get(0));
  },
  
  toggleLogout: function() {
    if (this.profileModel.isEmpty()) {
      $(this.logoutContainer).empty();
    } else {
      this.render('logout', this.profileModel.attributes, this.logoutContainer);
    }
  },  
  
  renderWithCallback: function(template, context, callback) {    
    template = template || 'landing';
    context = this.createDustBase().push(context || {});
    dust.render(template, context, function(err, out) {
      callback(err ? err : out);
    });    
  },
  
  render: function(template, context, container) {
    container = container || this.el;
    this.renderWithCallback(template, context, function(out) {
      $(container).html(out);
    });
  }
});