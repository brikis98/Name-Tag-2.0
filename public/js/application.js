var currentProfile = null;

function onLinkedInAuth() {
  IN.API
    .Profile('me')
    .fields('id', 'firstName', 'lastName', 'headline', 'location', 'positions', 'educations', 'pictureUrl')
    .result(gotProfile);
}

function createDustBase() {
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
    }
  });  
}

function showLogout() {
  dust.render('logout', currentProfile, function(err, out) {
    $('#logout-container').html(err ? err : out);
  });
}

function hideLogout() {
  $('#logout-container').empty();
}

function showCustomize() {
  var attrs = {
    eventLogo: 'http://' + window.location.host + '/images/logo.png', 
    eventName: 'LinkedIn Talent Connect 2011', 
    extended: false
  };
  var context = _.extend(currentProfile, attrs);  
  dust.render('customize', createDustBase().push(context), function(err, out) {
    $('#customize').html(err ? err : out);
  });  
}

function updateBadge() {
  var attrs = {
    eventLogo: $('#event-logo').val(),
    eventName: $('#event-name').val(),
    extended: $('#full').is(':checked') 
  };
  var context = _.extend(currentProfile, attrs);  
  dust.render('badge', createDustBase().push(context), function(err, out) {
    $('#badge').html(err ? err : out);
  });    
}

function hideCustomize() {
  $('#customize').empty();
}

function gotProfile(profiles) {
  currentProfile = profiles.values[0];
  showLogout();
  showCustomize();
  hideLanding();
}

function showLanding() {
  $('#landing-page').show();
}

function hideLanding() {
  $('#landing-page').hide();
}

$(function() {
  $('#logout').live('click', function(event) {
    event.preventDefault();
    IN.User.logout();
    hideLogout();
    hideCustomize();
    showLanding();
    currentProfile = null;
  });
  
  $('#event-name, #event-logo, #full, #mini').live('change', function(event) {
    updateBadge();
  });
});
