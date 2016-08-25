import {accordion, linkMenuAccordionItem} from './accordion.js';
var acc = accordion();
var toggles = [].slice.call(document.querySelectorAll("a[aria-haspopup]"));
var menus = toggles.map(function (toggleButton) {
  return linkMenuAccordionItem(acc, toggleButton);
});
menus.forEach(function (item) {
  acc.addItem(item);
  item.el.addEventListener('click', item.toggle.bind(item));
});
