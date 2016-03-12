var _ = require('lodash');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Should we populate the DB with sample data?
  seedDB: false,
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});