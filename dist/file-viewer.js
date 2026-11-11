(function () {
  "use strict";
  var active = null;
  function canPreview(file) {
    return !!file && !!file.url && file.previewable !== false &&
      !/\.(xlsx|xls|xlsm)(?:[?#]|$)/i.test(file.name || "") &&
      !/\.(xlsx|xls|xlsm)(?:[?#]|$)/i.test(file.url);
  }
  function close() {
    if (!active) return;
    var state = active;
    active = null;
    document.removeEventListener("keydown", state.keydown, true);
    state.inert.forEach(function (node) { node.inert = false; });
    state.drawer.remove();
    state.backdrop.remove();
    document.body.classList.remove("exact-drawer-open");
    if (state.opener && state.opener.isConnected) state.opener.focus();
  }
  function open(file) {
    if (!canPreview(file)) return;
    close();
    var opener = document.activeElement;
    var backdrop = document.createElement("div");
    backdrop.className = "exact-drawer-backdrop is-open";
    var drawer = document.createElement("aside");
    drawer.className = "exact-drawer exact-drawer--document exact-drawer--file is-open";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-labelledby", "file-viewer-title");
    drawer.innerHTML = '<header class="exact-drawer__header"><h2 id="file-viewer-title" class="exact-drawer__title"></h2><button type="button" class="exact-drawer__close" aria-label="Закрыть просмотр"></button></header><div class="exact-drawer__body"><iframe class="exact-document-frame"></iframe></div>';
    drawer.querySelector("h2").textContent = file.name;
    var frame = drawer.querySelector("iframe");
    var previewUrl = file.url;
    frame.title = "Просмотр " + file.name;
    frame.src = previewUrl + (/\.pdf$/i.test(previewUrl) ? "#toolbar=1&navpanes=0&view=FitH" : "");
    var inert = Array.from(document.body.children).filter(function (node) {
      return !node.inert && node.tagName !== "SCRIPT" && node.tagName !== "STYLE";
    });
    inert.forEach(function (node) { node.inert = true; });
    function keydown(event) {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
      if (event.key === "Tab") {
        var controls = Array.from(drawer.querySelectorAll("button, a[href], iframe")).filter(function (node) { return !node.closest("[hidden]"); });
        var first = controls[0];
        var last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    active = { drawer: drawer, backdrop: backdrop, opener: opener, inert: inert, keydown: keydown };
    backdrop.addEventListener("click", close);
    drawer.querySelector("button").addEventListener("click", close);
    document.addEventListener("keydown", keydown, true);
    document.body.append(backdrop, drawer);
    document.body.classList.add("exact-drawer-open");
    drawer.querySelector("button").focus();
  }
  window.OptimalogFileViewer = { open: open, close: close, canPreview: canPreview };
}());
