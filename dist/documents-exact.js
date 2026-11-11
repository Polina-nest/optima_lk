(function () {
  "use strict";

  var PAGE_SIZE = 10;
  var currentPage = 1;
  var allRows = Array.from(document.querySelectorAll("tr[data-doc-id]"));
  var filteredRows = allRows.slice();
  var resultLabel = document.querySelector(".areal-table__count__text");
  var pageInput = document.querySelector(".areal-pagination-input__wrapper input[type='number']");
  var pageTotal = document.querySelector(".areal-pagination-input__text");
  var prevButtons = Array.from(document.querySelectorAll(".areal-pagination-list__prev"));
  var nextButtons = Array.from(document.querySelectorAll(".areal-pagination-list__next"));

  function safeText(value) {
    return String(value == null ? "" : value).trim();
  }

  function setDisabled(button, disabled, className) {
    button.disabled = disabled;
    button.toggleAttribute("disabled", disabled);
    button.classList.toggle(className, disabled);
  }

  function renderTable() {
    var totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(1, currentPage), totalPages);
    var pageRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    allRows.forEach(function (row) {
      row.hidden = pageRows.indexOf(row) === -1;
    });

    if (resultLabel) {
      resultLabel.textContent = "Результатов: " + pageRows.length + " из " + filteredRows.length;
    }
    if (pageInput) {
      pageInput.value = currentPage;
      pageInput.max = totalPages;
    }
    if (pageTotal) pageTotal.textContent = "из " + totalPages;
    prevButtons.forEach(function (button) {
      setDisabled(button, currentPage === 1, "areal-pagination-list__prev--disabled");
    });
    nextButtons.forEach(function (button) {
      setDisabled(button, currentPage === totalPages, "areal-pagination-list__next--disabled");
    });
  }

  function filterTable() {
    var terms = Array.from(document.querySelectorAll(".areal-filter input"))
      .filter(function (input) { return input !== pageInput && !input.readOnly; })
      .map(function (input) { return safeText(input.value).toLocaleLowerCase("ru"); })
      .filter(Boolean);

    filteredRows = allRows.filter(function (row) {
      var rowText = safeText(row.textContent).toLocaleLowerCase("ru");
      return terms.every(function (term) { return rowText.indexOf(term) !== -1; });
    });
    currentPage = 1;
    renderTable();
  }

  function resetFilters() {
    document.querySelectorAll(".areal-filter input").forEach(function (input) {
      if (!input.readOnly) input.value = "";
    });
    filteredRows = allRows.slice();
    currentPage = 1;
    renderTable();
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
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function downloadFile(name, content, type) {
    var blob = new Blob([content], { type: type || "text/plain;charset=utf-8" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
  }

  function rowData(row) {
    var cells = row.querySelectorAll("td");
    return {
      id: row.dataset.docId,
      type: safeText(cells[0] && cells[0].textContent),
      name: row.dataset.fileName || safeText(cells[1] && cells[1].textContent),
      date: safeText(cells[2] && cells[2].textContent).replace(/\s+/g, " "),
      linkId: row.dataset.linkId,
      related: safeText(cells[3] && cells[3].textContent).replace(/\s+/g, " ")
    };
  }

  function downloadCsv() {
    var lines = [["ID", "Тип документа", "Имя файла", "Дата", "Связанная запись"]];
    filteredRows.forEach(function (row) {
      var data = rowData(row);
      lines.push([data.id, data.type, data.name, data.date, data.related]);
    });
    var csv = lines.map(function (line) {
      return line.map(function (value) { return '"' + String(value).replace(/"/g, '""') + '"'; }).join(";");
    }).join("\n");
    downloadFile("documents.csv", "\ufeff" + csv, "text/csv;charset=utf-8");
    showToast("Список документов скачан");
  }

  function localTarget(href) {
    var path;
    try { path = new URL(href, window.location.href).pathname; } catch (error) { return ""; }
    if (/\/quotes\/detail\//.test(path)) return "quote-detail.html";
    if (/\/applications\/detail\//.test(path)) return "request-detail.html";
    if (/\/quotes/.test(path)) return "quotes.html";
    if (/\/applications/.test(path)) return "requests.html";
    if (/\/declarations/.test(path)) return "declarations.html";
    if (/\/documents/.test(path)) return "documents.html";
    if (/\/invoices/.test(path)) return "invoices.html";
    if (/\/lkk\/?$/.test(path)) return "quotes.html";
    return "";
  }

  document.querySelectorAll("a[href]").forEach(function (link) {
    var target = localTarget(link.href);
    if (target) link.href = target;
  });

  var searchButton = Array.from(document.querySelectorAll(".areal-filter button")).find(function (button) {
    return safeText(button.textContent).indexOf("Найти") !== -1;
  });
  if (searchButton) searchButton.addEventListener("click", filterTable);
  document.querySelectorAll(".areal-filter input").forEach(function (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") filterTable();
    });
  });

  var resetLink = document.querySelector(".areal-filter__control-group__reset a");
  if (resetLink) resetLink.addEventListener("click", function (event) {
    event.preventDefault();
    resetFilters();
  });

  prevButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      currentPage = index === 0 ? 1 : Math.max(1, currentPage - 1);
      renderTable();
    });
  });
  nextButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      var last = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
      currentPage = index === nextButtons.length - 1 ? last : Math.min(last, currentPage + 1);
      renderTable();
    });
  });
  if (pageInput) pageInput.addEventListener("change", function () {
    currentPage = Number(pageInput.value) || 1;
    renderTable();
  });

  var tableActions = Array.from(document.querySelectorAll(".areal-table__count a"));
  tableActions.forEach(function (link) {
    var label = safeText(link.textContent);
    link.addEventListener("click", function (event) {
      event.preventDefault();
      if (label.indexOf("Скачать") !== -1) downloadCsv();
      if (label.indexOf("Настрой") !== -1) showToast("Колонки отображаются как в исходном кабинете");
    });
  });

  var widgetRoot = document.getElementById("support-widget-root");
  if (widgetRoot) widgetRoot.remove();

  renderTable();
}());
