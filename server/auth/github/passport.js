exports.setup = function (User, config) {
  var passport = require('passport');
  var GitHubStrategy = require('passport-github').Strategy;

  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    // console.log('token', token);
    User.findOne({
      'github.id_str': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log('token !user', token)
        exports.token = token
        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          appToken: token,
          provider: 'github',
          github: profile._json
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