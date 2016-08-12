const url = require('url');
const crypto = require('crypto');
const zdc = require('zdc')();

exports.callback = {
  method: 'get',
  path: '/callback',
  handler: function * (next) {
    const {code, state, error} = this.request.query;
    const {conf} = this.app.context;

    if (error) {
      throw new Error('not implemented');
    }

    if (code) {
      if (this.session.state === state) {
        const query = {
          redirect_uri: conf.value('zdc.auth.redirectUrl'),
          code,
          grant_type: 'authorization_code'
        };
        try {
          const auth = zdc.tokens(conf.value('zdc.auth'));
          const body = yield auth.create(query);
          const user = yield zdc.users(Object.assign(conf.value('zdc.api'), {token: body.access_token}))
            .me();
          this.session.user = Object.assign(user, {token: body});
          this.redirect('/');
        }
        catch (e) {
          console.log(e);
          throw new Error('not implemented');
        }
      } else {
        throw new Error('not implemented');
      }
    } else {
      this.throw(422);
    }

  }
};

exports.login = {
  method: 'get',
  path: '/login',
  handler: function * (next) {
    const {conf} = this.app.context;
    this.session.state = crypto.randomBytes(8).toString('base64');
    const uri = {
      host: 'localhost:3000',
      pathname: '/grants',
      query: {
        client_id: conf.value('zdc.auth.client_id'),
        redirect_uri: encodeURIComponent(conf.value('zdc.auth.redirectUrl')),
        state: this.session.state,
        response_type: 'code'
      }
    };

    this.redirect(url.format(uri));
  }
};

exports.logout = {
  method: 'get',
  path: '/logout',
  handler: function * (next) {
    this.session = null;
    this.redirect('/');
  }
};