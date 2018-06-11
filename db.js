'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');

const config = require('./config');

//let mongoCluster = `mongodb+srv://sandbox-rzvzt.mongodb.net/${config.db.name}`;
let uristring = `mongodb://arizafar:${config.db.password}@sandbox-shard-00-00-rzvzt.mongodb.net:27017,sandbox-shard-00-01-rzvzt.mongodb.net:27017,sandbox-shard-00-02-rzvzt.mongodb.net:27017/${config.db.name}?ssl=true&replicaSet=Sandbox-shard-0&authSource=admin`;

mongoose.connect(uristring);

// When successfully connected
mongoose.connection.on('connected', function() {
  console.log('Mongoose connection open to cluster');
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', function() {
  console.log('Mongoose connection is open');
});

module.exports = mongoose;
