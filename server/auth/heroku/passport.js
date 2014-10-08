exports.setup = function (User, config) {
  var passport = require('passport');
  var HerokuStrategy = require('passport-heroku').Strategy;

  passport.use(new HerokuStrategy({
    clientID: config.heroku.clientID,
    clientSecret: config.heroku.clientSecret,
    callbackURL: config.heroku.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    console.log('passport token: ', token, 'secret: ', tokenSecret, 'profile:', profile);
    profile._json.herokuToken = token;

    User.findOne({
      'heroku.id_str': profile.id
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log('token !user', token)
        exports.herokuToken = token;
        user = new User({
          name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'heroku',
          heroku: profile._json,
          herokuToken: token
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

exports.herokuToken = '';


// curl -X POST https://id.heroku.com/oauth/token \
// -d "grant_type=authorization_code&code=9d6d6077-bd6c-43fd-8de6-5f9ca931eff2&client_secret=5c61d9d2-0a25-406b-9cb7-0be2f3d2792c"