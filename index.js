const bucanero = require('bucanero');
const app = bucanero({plugins: ['bucanero-router']});
const zdc = require('zdc')();

app.start()
  .then(function () {
    app.use(function * () {
      if (this.path === '/') {
        const {zdcToken} = this.app.context;
        const classifieds = yield zdc.classifieds({token: zdcToken.access_token}).list();
        this.render('index', {user: this.session && this.session.user || {}, classifieds});
      }
    });
  });