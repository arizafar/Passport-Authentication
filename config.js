'use strict'

const config = {};

config.port = process.env.PORT || 3000;

config.db = {
  'name': process.env.DB_NAME || 'users',
  'user': process.env.DB_USER || '',
  'password': encodeURIComponent(process.env.DB_PASSWORD) || '',
}

config.secret = process.env.SECRET || 'mock#secret'

module.exports = config;
