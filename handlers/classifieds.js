const zdc = require('zdc')();

exports.new = {
  path: '/actions/new',
  method: 'get',
  handler: [function * (next) {
    if (!(this.session.user && this.session.user.id)) {
      this.throw(401, 'you must be autenticated to create a new classified');
    }
    yield *next
  }, function * () {
    return this.render('newClassified', {user: this.session.user});
  }]
};

exports.create = {
  path: '/',
  method: 'post',
  handler: function * () {
    const {conf} = this.app.context;
    const {title, content, price} = this.request.body;
    const {token} = this.session.user;

    const newClassified = yield zdc.classifieds(Object.assign(conf.value('zdc.api'), {token: token.access_token}))
      .create({title, content, price});

    this.redirect(`/classifieds/${newClassified.id}`);
  }
};

exports.self = {
  path: '/:classifiedId',
  method: 'get',
  handler: function * () {
    const {classifiedId}=this.params;
    const token = this.session.user && this.session.user.token || this.app.context.zdcToken;

    this.body = yield zdc.classifieds({token: token.access_token}).self({classifiedId});
  }
};