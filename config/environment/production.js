'use strict';

// Production specific configuration
// =================================
module.exports = {
  // MongoDB URL
  mongo: 'mongodb://localhost:27017/snickers',

  // Elasticsearch URL
  elasticsearch: 'localhost:9200',

  // MSG91
  msg91: {
    'auth_token': '106754AQHXQTHpCFK56e0ec22',
    'url': 'https://control.msg91.com/api/sendhttp.php',
    'sender': 'VERIFY',
    'route': 4
  }
};