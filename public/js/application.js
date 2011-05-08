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
      for (var i = start; i < end; i++) {
        chunk.render(bodies.block, context.rebase(list[i]));
      }
      return chunk;
    }
  });  
}

function showLogout(profile) {
  dust.render('logout', profile, function(err, out) {
    $('#logout-container').html(err ? err : out);
  });
}

function hideLogout() {
  $('#logout-container').empty();
}

function showCard(profile) {
  var attrs = {eventLogo: 'images/logo.png', eventName: 'Google I/O 2011', extended: true};
  var context = _.extend(profile, attrs);  
  dust.render('badge', createDustBase().push(context), function(err, out) {
    $('#badge').html(err ? err : out);
  });  
}

function hideCard() {
  $('#badge').empty();
}

function gotProfile(profiles) {
  var profile = profiles.values[0];
  showLogout(profile);
  showCard(profile);
  hideHello();
}

function showHello() {
  $('#hello').show();
}

function hideHello() {
  $('#hello').hide();
}

$(function() {
  $('#logout').live('click', function(event) {
    event.preventDefault();
    IN.User.logout();
    hideLogout();
    hideCard();
    showHello();
  });
});
