import {compose} from './stateFullComponent';

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

export function accordion (el) {
  var items = [];
  return Object.create(Accordion, {
    items: {value: items},
    el: {value: el}
  });
}

export function linkMenuAccordionItem (accordion, el) {
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