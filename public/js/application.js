function onLinkedInAuth() {
  IN.API
    .Profile('me')
    .fields('id', 'firstName', 'lastName', 'headline', 'location', 'positions', 'educations', 'pictureUrl')
    .result(gotProfile);
}

function gotProfile(profile) {
  var base = dust.makeBase({
    loop: function(chunk, context, bodies, params) {
      var list = context.current();
      var start = params.start || 0;
      var end = params.end || list.length;
      for (var i = start; i < end; i++) {
        chunk.render(bodies.block, context.rebase(list[i]));
      }
      return chunk;
    },
    eventLogo: 'images/logo.png',
    eventName: 'Google I/O 2011',
    extended: true
  });
  
  dust.render('badge', base.push(profile.values[0]), function(err, out) {
    $('body').append(err ? err : out);
  });
}
