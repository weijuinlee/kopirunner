const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}
test('text and control colors meet contrast thresholds on declared backgrounds', () => {
  const css = fs.readFileSync('style.css', 'utf8');
  const token = name => css.match(new RegExp(`--${name}: (#[a-f\\d]{6})`))[1];
  for (const [foreground, background] of [
    [token('ink'), token('surface-strong')],
    [token('ink-soft'), token('surface-strong')],
    [token('ink-soft'), token('bg')],
    [token('accent-strong'), token('accent-soft')],
    ['#fff8f2', token('accent')],
  ]) {
    assert.ok(contrast(foreground, background) >= 4.5, `${foreground} on ${background}`);
  }
  for (const background of ['surface-strong', 'bg']) {
    assert.ok(contrast(token('control-border'), token(background)) >= 3);
    assert.ok(contrast(token('accent'), token(background)) >= 3);
  }
});
test('removing the last order announces the result and moves focus to order list', () => {
  const nodes = new Map();
  function node() {
    const subnodes = new Map();
    return { value: '', textContent: '', hidden: false, dataset: {}, handlers: {},
      classList: { add() {}, remove() {} },
      addEventListener(name, fn) { this.handlers[name] = fn; },
      setAttribute(name, value) { this[name] = value; },
      append() {}, focus() { this.focused = true; },
      querySelector(selector) { if (!subnodes.has(selector)) subnodes.set(selector, node()); return subnodes.get(selector); },
      querySelectorAll() { return []; }, content: { cloneNode: node },
    };
  }
  const get = selector => { if (!nodes.has(selector)) nodes.set(selector, node()); return nodes.get(selector); };
  const order = { id: 'one', customerName: 'Mei', drinkName: 'Kopi', quantity: 1, notes: '' };
  const context = vm.createContext({
    document: { querySelector: get, createElement: node }, navigator: {},
    window: { localStorage: { getItem: key => key === 'kopi-runner-orders' ? JSON.stringify([order]) : null, setItem() {} } },
    setTimeout() {}, clearTimeout() {},
  });
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
  vm.runInContext('removeOrder("one")', context);
  assert.equal(get('#order-list').focused, true);
  assert.equal(get('#app-announcement').textContent, 'Removed Kopi for Mei.');
  assert.equal(get('#copy-summary').disabled, true);
});
