(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

function compose (behaviour, properties) {
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

var AccordionItem = {
  toggle: function () {
    this.accordion.toggleItem(this);
  }
};

var Accordion = {
  addItem: function (item) {
    this.items.push(item);
    return this;
  },
  toggleItem: function (item) {
    if (this.items.indexOf(item) !== -1) {
      this.items.forEach(function (i) {
        if (i === item) {
          i.isOpen = !i.isOpen;
        } else {
          i.isOpen = false;
        }
      });
    }
  }
};

var accordionItemFactory = compose(AccordionItem, ['isOpen']);

function accordion (el) {
  var items = [];
  return Object.create(Accordion, {
    items: {value: items},
    el: {value: el}
  });
}

function linkMenuAccordionItem (accordion, el) {
  var id = el.id;
  var menuIdParts = id.split('-');

  menuIdParts.push('menu');

  var menuId = menuIdParts.join('-');
  var isOpen = window.location.hash === '#' + menuId;

  const instance = accordionItemFactory();

  Object.defineProperty(instance, 'accordion', {value: accordion});
  Object.defineProperty(instance, 'el', {value: el});

  instance.on('isOpen', function () {
    var toggle = el;

    setTimeout(function () {
      toggle.href = instance.isOpen === true ? '#banner' : '#' + menuId;
      toggle.setAttribute('aria-expanded', instance.isOpen === true);
    }, 100);
  });

  instance.isOpen = isOpen;
  return instance;
}

var acc = accordion();
var toggles = [].slice.call(document.querySelectorAll("a[aria-haspopup]"));
var menus = toggles.map(function (toggleButton) {
  return linkMenuAccordionItem(acc, toggleButton);
});
menus.forEach(function (item) {
  acc.addItem(item);
  item.el.addEventListener('click', item.toggle.bind(item));
});

})));