'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const http = require('http');
const config = require('./config');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(session({
    secret: config.secret,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

server.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port} in ${app.get('env')} mode`);
});

require('./modules/passport')(passport);
require('./routes/routes')(app, passport);
