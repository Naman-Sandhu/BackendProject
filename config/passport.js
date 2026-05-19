const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        user.googleId = profile.id;
        user.profilePic = profile.photos?.[0]?.value || user.profilePic;
        await user.save();
      } else {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePic: profile.photos?.[0]?.value || '',
          password: 'GOOGLE_AUTH_USER'
        });
      }
    } else {
      // always refresh Google profile pic on every login
      if (profile.photos?.[0]?.value) {
        user.profilePic = profile.photos[0].value;
        await user.save();
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;