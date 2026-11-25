import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();

function createStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(String(key)) ? store.get(String(key)) : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(String(key));
    },
    clear() {
      store.clear();
    },
  };
}

function createClassList() {
  const set = new Set();
  return {
    add: (...names) => names.forEach((n) => set.add(n)),
    remove: (...names) => names.forEach((n) => set.delete(n)),
    contains: (name) => set.has(name),
    toggle: (name) => (set.has(name) ? (set.delete(name), false) : (set.add(name), true)),
  };
}

function createElement(id = "", tagName = "div") {
  return {
    id,
    tagName: tagName.toUpperCase(),
    value: "",
    innerText: "",
    textContent: "",
    innerHTML: "",
    src: "",
    style: {},
    classList: createClassList(),
    onclick: null,
    _listeners: new Map(),
    _children: [],
    addEventListener(type, fn) {
      if (!this._listeners.has(type)) this._listeners.set(type, []);
      this._listeners.get(type).push(fn);
    },
    dispatchEvent(evt) {
      for (const fn of this._listeners.get(evt.type) || []) fn(evt);
    },
    animate() {
      return {};
    },
    getBoundingClientRect() {
      return { top: 0 };
    },
    querySelector(selector) {
      return this._children.find((c) => c._matches === selector) || null;
    },
  };
}

function parseProductCards(html) {
  const cards = [];
  const cardRegex =
    /<div class="card product-card"[\s\S]*?<img\b[^>]*\bsrc="([^"]+)"[^>]*>[\s\S]*?<h3\b[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<div class="price">\s*(.*?)\s*<\/div>/g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const card = createElement("", "div");
    card.classList.add("card", "product-card");
    const img = createElement("", "img");
    img.src = match[1];
    img._matches = "img";
    const h3 = createElement("", "h3");
    h3.innerText = match[2].replace(/<[^>]+>/g, "").trim();
    h3._matches = "h3";
    const price = createElement("", "div");
    price.innerText = match[3].trim();
    price._matches = ".price";
    card._children = [img, h3, price];
    cards.push(card);
  }
  return cards;
}

export function loadHtmlApp(htmlFile, initialStorage = {}) {
  const html = fs.readFileSync(path.join(ROOT, htmlFile), "utf8");
  const localStorage = createStorage();
  for (const [k, v] of Object.entries(initialStorage)) {
    localStorage.setItem(k, v);
  }

  const elementsById = new Map();
  const idRegex = /\bid=["']([^"']+)["']/g;
  let m;
  while ((m = idRegex.exec(html)) !== null) {
    elementsById.set(m[1], createElement(m[1]));
  }

  const productCards = parseProductCards(html);
  const statsEl = createElement("", "section");
  const glowEl = createElement("", "div");
  const counters = [...html.matchAll(/class="counter" data-target="(\d+)"/g)].map((c) => {
    const el = createElement("", "h2");
    el.getAttribute = (attr) => (attr === "data-target" ? c[1] : null);
    return el;
  });

  const docListeners = new Map();
  const winListeners = new Map();
  const alerts = [];

  const document = {
    getElementById(id) {
      if (!elementsById.has(id)) elementsById.set(id, createElement(id));
      return elementsById.get(id);
    },
    querySelector(selector) {
      if (selector === ".stats") return statsEl;
      if (selector === ".mouse-glow") return glowEl;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === ".product-card") return productCards;
      if (selector === ".counter") return counters;
      if (selector === ".reveal") return [];
      return [];
    },
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, []);
      docListeners.get(type).push(fn);
    },
  };

  const windowObj = {
    innerHeight: 900,
    location: { href: htmlFile },
    addEventListener(type, fn) {
      if (!winListeners.has(type)) winListeners.set(type, []);
      winListeners.get(type).push(fn);
    },
    dispatchEvent() {},
  };

  class MockIntersectionObserver {
    observe() {}
    disconnect() {}
  }

  const timers = [];
  let nextTimerId = 1;

  const context = vm.createContext({
    window: windowObj,
    document,
    localStorage,
    alert: (msg) => alerts.push(msg),
    Event: class Event {
      constructor(type) {
        this.type = type;
      }
    },
    IntersectionObserver: MockIntersectionObserver,
    setTimeout(fn, ms) {
      const id = nextTimerId++;
      timers.push({ id, fn, ms });
      return id;
    },
    clearTimeout(id) {
      const index = timers.findIndex((timer) => timer.id === id);
      if (index !== -1) timers.splice(index, 1);
    },
    console: { log() {}, error() {}, warn() {} },
  });

  const scriptRegex = /<script(?:\s+src=["']([^"']+)["'])?[^>]*>([\s\S]*?)<\/script>/gi;
  let sm;
  while ((sm = scriptRegex.exec(html)) !== null) {
    if (sm[1]) {
      const ext = fs.readFileSync(path.join(ROOT, sm[1]), "utf8");
      vm.runInContext(ext, context, { filename: sm[1] });
    } else if (sm[2].trim()) {
      vm.runInContext(sm[2], context, { filename: htmlFile });
    }
  }

  for (const fn of docListeners.get("DOMContentLoaded") || []) {
    fn();
  }

  return {
    context,
    document,
    window: windowObj,
    localStorage,
    alerts,
    productCards,
    timers,
  };
}
