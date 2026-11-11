(function () {
  "use strict";

  var isDeclarations = document.body.dataset.page === "declarations-exact";
  var rowSelector = isDeclarations ? "tr[data-declaration-id]" : "tr[data-invoice-id]";
  var rows = Array.from(document.querySelectorAll(rowSelector));
  var activeStatus = "Все";

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  function showToast(message) {
    var toast = document.querySelector(".exact-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "exact-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  function filters() {
    return Array.from(document.querySelectorAll(".areal-filter input"))
      .filter(function (input) { return !input.readOnly; })
      .map(function (input) { return text(input.value).toLocaleLowerCase("ru"); })
      .filter(Boolean);
  }

  function render() {
    var terms = filters();
    var shown = 0;
    rows.forEach(function (row) {
      var haystack = (row.dataset.search || row.textContent).toLocaleLowerCase("ru");
      var statusOk = activeStatus === "Все" || row.dataset.status === activeStatus;
      var visible = statusOk && terms.every(function (term) { return haystack.indexOf(term) !== -1; });
      row.hidden = !visible;
      if (visible) shown += 1;
    });
    var result = document.querySelector(".areal-table__count__text");
    if (result) result.textContent = "Результатов: " + shown + " из " + shown;
  }

  function reset() {
    document.querySelectorAll(".areal-filter input").forEach(function (input) {
      if (!input.readOnly) input.value = "";
    });
    activeStatus = "Все";
    document.querySelectorAll(".areal-counter-tags").forEach(function (button, index) {
      button.classList.toggle("areal-counter-tags-active", index === 0);
    });
    render();
  }

  function download(name, content) {
    var blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
  }

  function downloadFile(name, url) {
    var link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character];
    });
  }

  function closeDocumentDrawer() {
    var backdrop = document.querySelector(".exact-drawer-backdrop");
    var drawer = document.querySelector(".exact-drawer");
    if (backdrop) backdrop.classList.remove("is-open");
    if (drawer) drawer.classList.remove("is-open");
    document.body.classList.remove("exact-drawer-open");
    setTimeout(function () {
      if (backdrop) backdrop.remove();
      if (drawer) drawer.remove();
    }, 210);
  }

  function openDocumentDrawer(url, name) {
    if (window.OptimalogFileViewer) {
      window.OptimalogFileViewer.open({ url: url, name: name });
      return;
    }
    closeDocumentDrawer();
    var backdrop = document.createElement("div");
    backdrop.className = "exact-drawer-backdrop";
    var drawer = document.createElement("aside");
    drawer.className = "exact-drawer exact-drawer--document";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.innerHTML = '<header class="exact-drawer__header"><h2 class="exact-drawer__title">' + escapeHtml(name) + '</h2><button type="button" class="exact-drawer__close" aria-label="Закрыть"></button></header><div class="exact-drawer__body"><iframe class="exact-document-frame" title="Просмотр ' + escapeHtml(name) + '"></iframe></div>';
    var frame = drawer.querySelector("iframe");
    frame.src = url.toLowerCase().endsWith(".pdf") ? url + "#toolbar=1&navpanes=0&view=FitH" : url;
    document.body.append(backdrop, drawer);
    backdrop.addEventListener("click", closeDocumentDrawer);
    drawer.querySelector(".exact-drawer__close").addEventListener("click", closeDocumentDrawer);
    document.body.classList.add("exact-drawer-open");
    requestAnimationFrame(function () {
      backdrop.classList.add("is-open");
      drawer.classList.add("is-open");
      drawer.querySelector(".exact-drawer__close").focus();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && document.querySelector(".exact-drawer.is-open")) closeDocumentDrawer();
  });

  var searchButton = Array.from(document.querySelectorAll(".areal-filter button")).find(function (button) {
    return text(button.textContent) === "Найти";
  });
  if (searchButton) searchButton.addEventListener("click", render);
  document.querySelectorAll(".areal-filter input").forEach(function (input) {
    input.addEventListener("keydown", function (event) { if (event.key === "Enter") render(); });
  });
  var resetLink = document.querySelector(".areal-filter__control-group__reset a");
  if (resetLink) resetLink.addEventListener("click", function (event) { event.preventDefault(); reset(); });

  document.querySelectorAll(".areal-counter-tags").forEach(function (button) {
    button.addEventListener("click", function () {
      activeStatus = text(button.querySelector(".areal-counter-tags-content-text").textContent);
      document.querySelectorAll(".areal-counter-tags").forEach(function (item) {
        item.classList.toggle("areal-counter-tags-active", item === button);
      });
      render();
    });
  });

  rows.forEach(function (row) {
    row.addEventListener("click", function (event) {
      if (event.target.closest("a,button")) return;
      if (isDeclarations) window.location.href = "declaration-detail.html?id=" + encodeURIComponent(row.dataset.declarationId);
    });
    var open = row.querySelector("[data-open]");
    if (open) open.addEventListener("click", function () {
      window.location.href = "declaration-detail.html?id=" + encodeURIComponent(row.dataset.declarationId);
    });
    row.querySelectorAll("[data-file-preview]").forEach(function (file) {
      file.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var url = file.dataset.fileUrl || file.getAttribute("href");
        var name = file.dataset.fileName || text(file.textContent) || url.split("/").pop();
        openDocumentDrawer(url, name);
      });
    });
    row.querySelectorAll("[data-file-download]").forEach(function (file) {
      file.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        downloadFile(file.dataset.fileName, file.dataset.fileUrl);
        showToast(isDeclarations ? "Декларация скачана" : "Счет скачан");
      });
    });
    row.querySelectorAll("[data-download]").forEach(function (file) {
      file.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var id = row.dataset.invoiceId;
        download(id + ".csv", "\ufeffНомер;Статус\n" + id + ";" + row.dataset.status);
        showToast("Счет скачан");
      });
    });
  });

  Array.from(document.querySelectorAll("a")).filter(function (link) {
    return text(link.textContent) === "Скачать" && link.closest(".table-registry-actions");
  }).forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var header = isDeclarations ? "Декларация;Заявка;Статус" : "Счет;Заявка;Статус";
      var body = rows.filter(function (row) { return !row.hidden; }).map(function (row) {
        return [row.dataset.declarationId || row.dataset.invoiceId, text(row.querySelector("a") && row.querySelector("a").textContent), row.dataset.status].join(";");
      });
      download(isDeclarations ? "declarations.csv" : "invoices.csv", "\ufeff" + [header].concat(body).join("\n"));
      showToast("Список скачан");
    });
  });

  Array.from(document.querySelectorAll("a")).filter(function (link) {
    return text(link.textContent) === "Настройка";
  }).forEach(function (link) {
    link.addEventListener("click", function (event) { event.preventDefault(); showToast("Настройки колонок сохранены"); });
  });

  render();
})();
