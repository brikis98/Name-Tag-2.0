(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  NameTag.NameTagView = Backbone.View.extend({
    initialize: function(options) {
      _.bindAll(this, 'print', 'statusClicked', 'statusBlur', 'done', 'createDustBase', 'getDoneOverlay', 'shortenUrl', 'getFullContext', 'getCustomizeContext', 'renderShow', 'renderCustomize', 'updateCustomize', 'eventOptionsChanged', 'parse', 'toggleLogout', 'renderWithCallback', 'render');
      this.logoutContainer = '#logout-container';
      this.loginContainer = '#login-container';
      this.badgeContainer = '#badge';
      this.doneContainer = '#done-contents';
      this.optionsForm = '#options-form';
      this.statusContainer = '#status-text';
      this.uploadContainer = '#upload';
      this.profileModel = options.profileModel;
      return this.eventModel = options.eventModel;
    },
    events: {
      'change input.event-options': 'eventOptionsChanged',
      'keyup input.event-options': 'eventOptionsChanged',
      'click .blue-button': 'done',
      'click #print a': 'print',
      'click #status-text': 'statusClicked',
      'blur #status-text': 'statusBlur'
    },
    print: function(event) {
      var options, printDocument, printWindow;
      event.preventDefault();
      printWindow = window.open('', 'Print Name Tag | Name Tag 2.0', 'height=550, width=500, scrollbars=1');
      printDocument = printWindow.document;
      options = {
        hidePrint: true,
        hideStatusInput: true,
        hasStatus: !$(this.statusContainer).hasClass('empty'),
        status: $(this.statusContainer).val()
      };
      return this.renderWithCallback('badge', _.extend({}, this.getFullContext(), options), __bind(function(out) {
        printDocument.write("<html><head><link href=\"/css/application.css\" rel=\"stylesheet\" type=\"text/css\"/></head><body>" + out + "</body></html>");
        return printDocument.close();
      }, this));
    },
    statusClicked: function(event) {
      var textArea;
      textArea = $(event.target);
      if (textArea.hasClass('empty')) {
        textArea.val('');
        return textArea.removeClass('empty');
      }
    },
    statusBlur: function(event) {
      var textArea;
      textArea = $(event.target);
      if (textArea.val() === '') {
        textArea.val('Enter a status');
        return textArea.addClass('empty');
      }
    },
    done: function() {
      return this.getDoneOverlay().overlay().load();
    },
    createDustBase: function() {
      return dust.makeBase({
        loop: function(chunk, context, bodies, params) {
          var end, i, list, start;
          list = context.current();
          start = params.start || 0;
          end = params.end || list.length;
          if (start < 0) {
            start = 0;
          }
          if (end > list.length) {
            end = list.length;
          }
          for (i = start; start <= end ? i <= end : i >= end; start <= end ? i++ : i--) {
            chunk.render(bodies.block, context.rebase(list[i]));
          }
          return chunk;
        },
        equals: function(chunk, context, bodies, params) {
          var value;
          value = context.current();
          if (value === params.value) {
            chunk.render(bodies.block, context);
          }
          return chunk;
        }
      });
    },
    getDoneOverlay: function() {
      if (!this.doneOverlay) {
        this.doneOverlay = $('#done-overlay').overlay({
          mask: {
            color: '#ebecff',
            loadSpeed: 200,
            opacity: 0.9
          },
          oneInstance: false,
          onBeforeLoad: __bind(function() {
            return this.shortenUrl("http://" + window.location.host + "#show/" + (this.eventModel.url()), __bind(function(shortUrl) {
              return this.render('done', {
                showUrl: shortUrl
              }, this.doneContainer);
            }, this));
          }, this)
        });
      }
      return this.doneOverlay;
    },
    shortenUrl: function(url, callback) {
      return $.get('/shorten', {
        url: url
      }, callback);
    },
    getFullContext: function() {
      return _.extend({}, this.profileModel.attributes, this.eventModel.attributes);
    },
    getCustomizeContext: function() {
      return _.extend({}, this.getFullContext(), {
        hidePrint: true
      });
    },
    renderCustomize: function() {
      this.eventModel.unbind('change');
      this.eventModel.bind('change', this.updateCustomize);
      return this.render('customize', this.getCustomizeContext(), this.el, __bind(function() {
        var _ref;
        return (_ref = this.uploader) != null ? _ref : this.uploader = new qq.FileUploader({
          element: $(this.uploadContainer).get(0),
          action: '/upload',
          allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
          params: {
            id: this.profileModel.get('id')
          },
          onComplete: __bind(function(id, fileName, responseJSON) {
            if (responseJSON.success) {
              return this.eventModel.set({
                eventLogo: "http://" + window.location.host + responseJSON.url
              });
            }
          }, this)
        });
      }, this));
    },
    renderShow: function() {
      this.eventModel.unbind('change');
      return this.render('badge', this.getFullContext());
    },
    eventOptionsChanged: function(event) {
      var values;
      values = $(this.optionsForm).serializeObject();
      return this.eventModel.set(values);
    },
    updateCustomize: function() {
      this.controller.saveLocation("#customize/" + (this.eventModel.url()));
      $(this.optionsForm).populate(this.eventModel.attributes);
      return this.render('badge', this.getCustomizeContext(), this.badgeContainer);
    },
    parse: function(container) {
      if (container == null) {
        container = this.loginContainer;
      }
      return IN.parse($(container).get(0));
    },
    toggleLogout: function() {
      if (this.profileModel.isEmpty()) {
        return $(this.logoutContainer).empty();
      } else {
        return this.render('logout', this.profileModel.attributes, this.logoutContainer);
      }
    },
    renderWithCallback: function(template, context, callback) {
      if (template == null) {
        template = 'landing';
      }
      if (context == null) {
        context = {};
      }
      context = this.createDustBase().push(context);
      return dust.render(template, context, __bind(function(err, out) {
        return callback(err ? err : out);
      }, this));
    },
    render: function(template, context, container, callback) {
      if (container == null) {
        container = this.el;
      }
      return this.renderWithCallback(template, context, __bind(function(out) {
        $(container).html(out);
        return typeof callback === "function" ? callback() : void 0;
      }, this));
    }
  });
}).call(this);
