const zdc = require('zdc')();

module.exports = {
  priority: 400,
  init: function (app) {
    const {conf} = app.context;
    return zdc.tokens(conf.value('zdc.auth')).create({grant_type: 'client_credentials'})
      .then(token => {
        app.context.zdcToken = token;
      });
  }
};