export function compose (behaviour, properties) {
  var props = properties || [];
  return function factory () {
    var listeners = {};
    var instance = Object.create(Object.assign({}, behaviour, {
      _onChange: function (prop) {
        var ls = listeners[prop] || [];
        ls.forEach(function (cb) {
          cb();
        });
      },
      on: function (event, cb) {
        var listenersList = listeners[event] || [];
        listenersList.push(cb);
        listeners[event] = listenersList;
        return this;
      }
    }));
    props.forEach(function (prop) {
      var value;
      Object.defineProperty(instance, prop, {
        get: function () {
          return value;
        },
        set: function (val) {
          value = val;
          this._onChange(prop);
        }
      })
    });

    return instance;
  }
}