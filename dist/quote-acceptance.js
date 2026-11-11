(function () {
  "use strict";

  var PREFIX = "optimalog.quote-acceptance.v1.";
  var DURATION = 10 * 60 * 1000;
  var memory = Object.create(null);
  var watched = Object.create(null);
  var listeners = [];
  var timer;

  function read(id) {
    var raw = memory[id];
    try { raw = window.localStorage.getItem(PREFIX + id) || raw; } catch (_) {}
    try {
      var entry = JSON.parse(raw);
      return entry && Number.isFinite(entry.expiresAt) &&
        typeof entry.previous.status === "string" && typeof entry.previous.color === "string" ? entry : null;
    } catch (_) { return null; }
  }

  function getState(id, fallback) {
    watched[id] = true;
    var entry = read(id);
    if (!entry) return fallback;
    if (entry.expiresAt > Date.now()) return { status: "Запрос акцептован", color: "#5CB85C" };
    return entry.previous;
  }

  function refresh() {
    window.clearTimeout(timer);
    listeners.slice().forEach(function (listener) { listener(); });
    var now = Date.now();
    var next = Infinity;
    Object.keys(watched).forEach(function (id) {
      var entry = read(id);
      if (entry && entry.expiresAt > now) next = Math.min(next, entry.expiresAt);
    });
    if (next !== Infinity) timer = window.setTimeout(refresh, Math.max(1, next - now));
  }

  function canAccept(status) {
    return status === "Котировка завершена";
  }

  function canDecline(status) {
    return status === "Размещен запрос" || status === "Принят в работу" || status === "Котировка завершена";
  }

  function accept(id, previous) {
    var entry = read(id);
    if (!canAccept(previous.status) || (entry && entry.expiresAt > Date.now())) return false;
    memory[id] = JSON.stringify({ expiresAt: Date.now() + DURATION, previous: { status: previous.status, color: previous.color } });
    try { window.localStorage.setItem(PREFIX + id, memory[id]); } catch (_) {}
    refresh();
    return true;
  }

  function clear(id) {
    delete memory[id];
    try { window.localStorage.removeItem(PREFIX + id); } catch (_) {}
    refresh();
  }

  function subscribe(listener) {
    listeners.push(listener);
    refresh();
    return function () { listeners = listeners.filter(function (item) { return item !== listener; }); };
  }

  window.addEventListener("storage", function (event) {
    if (event.key === null || event.key.indexOf(PREFIX) === 0) {
      if (event.key === null) memory = Object.create(null);
      else delete memory[event.key.slice(PREFIX.length)];
      refresh();
    }
  });
  // Recheck wall-clock expiry when returning from a suspended tab or history.
  window.addEventListener("pageshow", refresh);
  window.addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) refresh(); });
  window.OptimalogQuoteAcceptance = { getState: getState, accept: accept, clear: clear, subscribe: subscribe, canAccept: canAccept, canDecline: canDecline };
}());
