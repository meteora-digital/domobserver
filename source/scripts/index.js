/**
 * DomObserverController
 *
 * A lightweight DOM mutation observer utility for tracking elements matching specific selectors.
 *
 * Features:
 * - Observe DOM changes for elements matching CSS selectors.
 * - Supports multiple agents with different selectors and callbacks.
 * - Efficiently manages MutationObservers to avoid redundant observers.
 * - Provides a simple API for observing, disconnecting, and handling DOM mutations.
 *
 * Usage Example:
 *
 * import DomObserverController from 'domobserverjs';
 *
 * window.DomObserver = new DomObserverController();
 * DomObserver.observe('.my-class', (items) => {
 *   items.forEach((item) => {
 *     console.log('New item:', item);
 *   });
 * });
 */

// Default settings for MutationObserver
const DEFAULT_DOMOBSERVER_SETTINGS = {
  childList: true,
  subtree: true,
};

// Default callback for observed elements
const DEFAULT_DOMOBSERVER_CALLBACK = (items) => console.log('DomObserver:', items);

function normalizeSettings(settings) {
  return JSON.stringify(Object.keys(settings).sort().reduce((obj, key) => {
    obj[key] = settings[key];
    return obj;
  }, {}));
}

/**
 * DomObserverController
 * Manages MutationObservers and agents for DOM element tracking.
 */
export default class DomObserverController {
  constructor() {
    this.agents = [];
    this.observers = new Map();
  }

  findOrCreateObserver(settings) {
    const normalized = normalizeSettings(settings);

    if (this.observers.has(normalized)) {
      return this.observers.get(normalized);
    }

    const observer = new MutationObserver((mutationRecords) => {
      // Notify agents with matching settings
      this.agents
        .filter(agent => normalizeSettings(agent.settings) === normalized)
        .forEach(agent => agent.update(mutationRecords));
    });

    observer.observe(document.body, settings);
    this.observers.set(normalized, observer);
    return observer;
  }

  observe(selector = '', callback = DEFAULT_DOMOBSERVER_CALLBACK, settings = {}) {
    if (!selector) {
      return console.error('DomObserver not created: No selector provided');
    }
    if (typeof callback !== 'function') {
      return console.error('DomObserver not created: No valid callback provided');
    }

    const mergedSettings = { ...DEFAULT_DOMOBSERVER_SETTINGS, ...settings };
    this.findOrCreateObserver(mergedSettings);

    const agent = new DomObserverAgent(selector, callback, mergedSettings);
    this.agents.push(agent);
    return agent;
  }

  // Disconnects all MutationObservers and clears agents.
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.agents = [];
  }
}

/**
 * DomObserverAgent
 * Tracks elements matching a selector and invokes a callback on new matches.
 */
class DomObserverAgent {
  constructor(selector, callback, settings) {
    this.cache = new WeakSet();
    this.selector = selector;
    this.callback = callback;
    this.settings = settings;
    this.updateTimeout = null;

    // Initial scan for existing elements
    this.scanDom();
  }

  update(mutationRecords = []) {
    if (this.updateTimeout) clearTimeout(this.updateTimeout);

    this.updateTimeout = setTimeout(() => {
      if (mutationRecords.length === 0) {
        this.scanDom();
        return;
      }

      const newMatches = [];

      for (const record of mutationRecords) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;

          // Direct match
          if (node.matches(this.selector) && !this.cache.has(node)) {
            this.cache.add(node);
            newMatches.push(node);
          }

          // Descendant matches
          if (node.querySelectorAll) {
            node.querySelectorAll(this.selector).forEach((el) => {
              if (!this.cache.has(el)) {
                this.cache.add(el);
                newMatches.push(el);
              }
            });
          }
        }
      }

      if (newMatches.length > 0) {
        this.callback(newMatches);
      }
    }, 100);
  }

  // Scans the DOM for elements matching the selector.
  scanDom() {
    const elements = Array.from(document.querySelectorAll(this.selector));
    const newItems = elements.filter((el) => !this.cache.has(el));

    if (newItems.length > 0) {
      newItems.forEach((el) => this.cache.add(el));
      this.callback(newItems);
    }
  }

  // Disconnects the agent and clears its cache.
  disconnect() {
    clearTimeout(this.updateTimeout);
    this.cache.clear();
  }
}
