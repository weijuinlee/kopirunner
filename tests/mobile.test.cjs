const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function element() {
  return { value: '', hidden: true, required: true, textContent: '', children: [], handlers: {},
    classList: { add() {}, remove() {} }, dataset: {},
    addEventListener(name, fn) { this.handlers[name] = fn; },
    append(child) { this.children.push(child); }, focus() {}, select() {},
    setAttribute(name, value) { this[name] = value; },
    querySelector() { return element(); },
    content: { cloneNode() { return element(); } }, reset() {} };
}
test('custom drink submission, summary, sharing, and cancelled clear', async () => {
  const elements = new Map();
  const get = (id) => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
  let shared;
  const storage = new Map();
  vm.runInNewContext(fs.readFileSync('app.js', 'utf8'), {
    document: { querySelector: get, createElement: element },
    navigator: { share: async (data) => { shared = data; } },
    window: { confirm: () => false, localStorage: { getItem: (k) => storage.get(k), setItem: (k,v) => storage.set(k,v) } },
    setTimeout() {}, clearTimeout() {}, console,
  });
  get('#customer-name').value = 'Test person';
  get('#special-drink').value = 'Milo Peng';
  get('#quantity').value = '2';
  get('#special-drink').handlers.input();
  assert.equal(get('#drink-select').required, false);
  get('#order-form').handlers.submit({ preventDefault() {} });
  assert.match(get('#summary-output').value, /2 x Milo Peng/);
  assert.equal(get('#order-count').textContent, 2);
  assert.equal(get('#drink-select').required, true);
  await get('#share-summary').handlers.click();
  assert.match(shared.text, /Total cups: 2/);
  get('#clear-orders').handlers.click();
  assert.match(get('#summary-output').value, /Milo Peng/);
});
test('Android fallback, offline feedback, and opt-in worker activation', async () => {
  const elements = new Map();
  const get = (id) => { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); };
  const events = {}, workerEvents = {};
  let activated = false, reloaded = false;
  const registration = { waiting: { postMessage(data) { activated = data.type === 'ACTIVATE_UPDATE'; } }, addEventListener() {} };
  vm.runInNewContext(fs.readFileSync('pwa.js', 'utf8'), {
    document: { getElementById: get }, console,
    navigator: { userAgent: 'Android', platform: 'Linux', onLine: false,
      serviceWorker: { controller: {}, register: async () => registration, addEventListener: (name, fn) => workerEvents[name] = fn } },
    window: { isSecureContext: true, matchMedia: () => ({ matches: false, addEventListener() {} }),
      addEventListener: (name, fn) => events[name] = fn, location: { reload() { reloaded = true; } } },
  });
  await Promise.resolve();
  assert.equal(get('install-card').hidden, false);
  assert.equal(get('install-android-steps').hidden, false);
  assert.equal(get('connection-status').hidden, false);
  assert.equal(get('update-notice').hidden, false);
  workerEvents.controllerchange(); assert.equal(reloaded, false);
  get('update-app').handlers.click(); assert.equal(activated, true);
  workerEvents.controllerchange(); assert.equal(reloaded, true);
});
test('service worker serves cached shell with tracking query offline', async () => {
  const events = {};
  const saved = { status: 200 };
  vm.runInNewContext(fs.readFileSync('sw.js', 'utf8'), {
    URL, Set, caches: { open: async () => ({ match: async (url) => url === 'https://example.com/kopirunner/' ? saved : undefined }) },
    self: { registration: { scope: 'https://example.com/kopirunner/' }, addEventListener: (name, fn) => events[name] = fn },
    fetch: async () => { throw new Error('offline'); },
  });
  let response;
  events.fetch({ request: { method: 'GET', url: 'https://example.com/kopirunner/?utm_source=chat' }, respondWith(promise) { response = promise; } });
  assert.equal(await response, saved);
});
