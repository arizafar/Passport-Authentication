'use strict';

require('../db');
const User = require('../models/user');

module.exports = function(app, passport) {
  app.get('/', (req, res) => {
      res.json('Authentication App.');
  });

  app.get('/login', (req, res) => {
      res.json({message: req.flash('loginMessage')});
  });

  app.post('/login', passport.authenticate('login', {
      successRedirect : '/profile',
      failureRedirect : '/login',
      failureFlash : true
  }));

  app.get('/register', (req, res) => {
      res.json({message: req.flash('registerMessage')});
  });

  app.post('/register', passport.authenticate('register', {
      successRedirect : '/profile',
      failureRedirect : '/register',
      failureFlash : true
  }));

  app.get('/profile', isLoggedIn, (req,res) => {
      res.json({user : req.user, session_id: req.sessionID});
  });

  app.get('/logout', (req,res) => {
      req.logout();
      res.redirect('/');
  });

  app.post('/update',isLoggedIn, (req, res) => {
    let user = new User();
    let loggedUser = req.body;
    if(loggedUser.password) {
      loggedUser.password = user.generateHash(loggedUser.password);
    }
    User.updateOne({email: req.body.email}, {$set: loggedUser}, (err, user) => {
      if(err) {
        res.json('error when updating user');
      } else {
        res.redirect('/profile');
      }
    });
  });

};

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
  return next();
  res.redirect('/');
};
