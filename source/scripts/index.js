// The default settings for each dom observer
const DEFAULT_DOMOBSERVER_SETTINGS = {
  childList: true,
  subtree: true,
};

// The default callback for each dom observer
const DEFAULT_DOMOBSERVER_CALLBACK = (items) => console.log('DomObserver:', items);

export default class DomObserverController {
  constructor() {
    this.agents = [];
    this.observers = new Map();
  }

  findOrCreateObserver(settings) {
    let observer = this.observers.get(settings);
    if (observer) return observer;

    observer = new MutationObserver(() => {
      const agents = this.agents.filter((agent) => agent.settings === settings);
      agents.forEach((agent) => agent.update());
    });

    observer.observe(document.body, settings);
    this.observers.set(settings, observer);

    return observer;
  }

  observe(selector = '', callback = DEFAULT_DOMOBSERVER_CALLBACK, settings = DEFAULT_DOMOBSERVER_SETTINGS) {
    if (!selector) return console.error(selector + ' DomObserver not created: No selector provided');
    if (!callback || typeof callback !== 'function') return console.error(selector + ' DomObserver not created: No callback provided');

    settings = Object.assign(settings, DEFAULT_DOMOBSERVER_SETTINGS);
    this.findOrCreateObserver(settings);

    const Agent = new DomObserver(selector, callback, settings);
    this.agents.push(Agent);
  }
}

class DomObserver {
  constructor(selector, callback, settings) {
    this.cache = new Set();
    this.timeouts = {};
    this.selector = selector;
    this.callback = callback;
    this.settings = settings;

    this.update();
  }

  update() {
    clearTimeout(this.timeouts['update']);

    this.timeouts['update'] = setTimeout(() => {
      const items = [...document.querySelectorAll(this.selector)].filter((item) => !this.cache.has(item));

      if (!items.length) return;

      items.forEach((item) => this.cache.add(item));
      this.callback(items);
    }, 100);
  }
}
