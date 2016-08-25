// const logger = require('../middlewares/logger');
const bodyParser = require('koa-bodyparser');
const Pug = require('koa-pug');
const gzip = require('koa-gzip');
const sessions = require('koa-generic-session');
const koa = require('koa');
const fileServer = require('koa-static');
const mount = require('koa-mount');

module.exports = {
  priority: 200,
  init: function (app) {
    app.keys = app.context.conf.value('server.cookies.keys');
    app
      .use(gzip())
      // .use(logger())
      .use(bodyParser())
      .use(sessions());

    if (process.env.NODE_ENV !== 'test') {
      const pug = new Pug({
        app,
        viewPath: './views'
      });
    } else {
      app.use(function * (next) {
        this.render = function (template, locals) {
          this.body = {template, locals};
          debug(this.body);
        };
        yield *next;
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      const fs = fileServer('./public/dist');
      app.use(mount('/public', fs));
    }

    return app;
  }
};