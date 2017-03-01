"use strict"

var request = require('request');

var Message = function () {};

Message.prototype.sendOTP = function (data, callback) {
  request({
    url: process.env.MSG91_URL,
    qs: {
      'authkey': process.env.MSG91_TOKEN,
      'mobiles': data.country + '' + data.number,
      'message': data.message,
      'sender': process.env.MSG91_SENDER,
      'route': process.env.MSG91_ROUTE,
      'country': data.country
    }, //Query string data
    method: 'GET'
  }, callback);
};

module.exports = new Message();
