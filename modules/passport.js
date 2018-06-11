const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
let loggedUser = {email: '', count: 1, date: null};

module.exports = function(passport) {

  passport.serializeUser((user, callback) => {
      callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    User.findById(id, (err, user) => {
      callback(err, user);
    });
  });

  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, callback) => {
      User.findOne({email: email}, (err, user) => {
        if (err) {
          return callback(err);
        }
        if (user) {
          return callback(null, false, req.flash('registerMessage', 'Entered email id is already registered, try with different id or login.' ));
        } else {
          let newUser = new User();
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.save((err) => {
            if(err) throw err;
            return callback(null, newUser);
          });
        }
      });
  }));

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, callback) => {
    console.log(JSON.stringify(loggedUser));
      User.findOne({email: email}, (err, user) => {
        if (err) {
          return callback(err);
        }
        if (!user) {
          return callback(null, false, req.flash('loginMessage','user does not exist please signup'));
        }
        if(loggedUser.email == email && loggedUser.count == 3) {
          let diffTime = new Date() - loggedUser.date;
          if(diffTime < 60*1000) {
            return callback(null, false,  req.flash('loginMessage', `too many wrong inputs wait for ${60 - diffTime/1000} seconds` ));
          }
        }
        if (!user.validPassword(password)) {
          if(loggedUser.email == email) {
            loggedUser.count +=1;
          } else {
            loggedUser.email = email;
            loggedUser.date = new Date();
          }
          return callback(null, false,  req.flash('loginMessage','Invalid password, please try with valid password' ));
        }
        if(loggedUser.email == email) {
          loggedUser = {email: '', count: 1, date: null};
        }
        return callback(null, user);
      });
    }
  ));
};
