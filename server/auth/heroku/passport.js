exports.setup = function (User, config) {
  var passport = require('passport');
  var HerokuStrategy = require('passport-heroku').Strategy;

  passport.use(new HerokuStrategy({
    clientID: config.heroku.clientID,
    clientSecret: config.heroku.clientSecret,
    callbackURL: config.heroku.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    console.log('passport token', token, tokenSecret, profile);
    User.findOne({
      'heroku.id_str': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        exports.token = token
        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'heroku',
          heroku: profile._json
        });
        user.save(function(err) {
          if (err) return done(err);
          return done(err, user);
        });
      } else {
        console.log('token user', token)
        return done(err, user);
      }
    });
    }
  ));
};

exports.token = '';