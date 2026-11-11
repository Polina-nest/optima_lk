(function () {
  "use strict";

  var rows = Array.from(document.querySelectorAll("tr[data-quote-id]"));
  var activeStatus = "Все";
  var acceptance = window.OptimalogQuoteAcceptance;
  var originalRows = rows.map(function (row) {
    var badge = row.querySelector(".tag-background");
    return { row: row, search: row.dataset.search, state: { status: row.dataset.status, color: badge.style.getPropertyValue("--tag-bg").trim() } };
  });

  function refreshStatuses() {
    originalRows.forEach(function (original) {
      var row = original.row;
      var state = acceptance.getState(row.dataset.quoteId, original.state);
      row.dataset.status = state.status;
      if (original.search) row.dataset.search = original.search.replace(original.state.status, state.status);
      row.querySelector(".areal-tag__content").textContent = state.status;
      row.querySelector(".tag-background").style.setProperty("--tag-bg", state.color);
    });
    document.querySelectorAll(".areal-counter-tags").forEach(function (button) {
      var label = text(button.querySelector(".areal-counter-tags-content-text").textContent);
      var count = rows.filter(function (row) { return label === "Все" || row.dataset.status === label; }).length;
      button.querySelector(".areal-counter-tags-notifications").textContent = count;
    });
    applyFilters();
  }

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
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
  }

  function pairedButtonRow(row) {
    var id = row.dataset.quoteId;
    return document.querySelector('tr[data-expansion-for="' + id + '"]');
  }

  function currentTerms() {
    return Array.from(document.querySelectorAll(".areal-filter input"))
      .map(function (input) { return text(input.value).toLocaleLowerCase("ru"); })
      .filter(Boolean);
  }

  function applyFilters() {
    var terms = currentTerms();
    rows.forEach(function (row) {
      var matchesStatus = activeStatus === "Все" || row.dataset.status === activeStatus;
      var haystack = (row.dataset.search || row.textContent).toLocaleLowerCase("ru");
      var matchesTerms = terms.every(function (term) { return haystack.indexOf(term) !== -1; });
      var visible = matchesStatus && matchesTerms;
      row.hidden = !visible;
      var pair = pairedButtonRow(row);
      if (pair) pair.hidden = !visible;
      var expanded = document.querySelector('tr[data-expanded-for="' + row.dataset.quoteId + '"]');
      if (expanded && !visible) expanded.remove();
    });
  }

  function resetFilters() {
    document.querySelectorAll(".areal-filter input").forEach(function (input) { input.value = ""; });
    activeStatus = "Все";
    document.querySelectorAll(".areal-counter-tags").forEach(function (button) {
      var label = text(button.querySelector(".areal-counter-tags-content-text") && button.querySelector(".areal-counter-tags-content-text").textContent);
      button.classList.toggle("areal-counter-tags-active", label === "Все");
    });
    applyFilters();
  }

  function openFilterMenu(wrapper) {
    document.querySelectorAll(".quote-filter-menu").forEach(function (menu) { menu.remove(); });
    var labelNode = wrapper.querySelector("label, .areal-native-combobox__label");
    var label = text(labelNode && labelNode.textContent);
    var input = wrapper.querySelector("input");
    if (!input) return;
    var options;
    if (label.indexOf("Как везем") !== -1) {
      options = ["АВИА", "АВТО", "ЖД", "МОРЕ"];
    } else if (label.indexOf("Куда доставить") !== -1) {
      options = Array.from(new Set(rows.map(function (row) { return text(row.children[3] && row.children[3].textContent).split("Склад")[0]; })));
    } else {
      options = Array.from(new Set(rows.map(function (row) { return text(row.children[2] && row.children[2].textContent).split("Склад")[0]; })));
    }
    var menu = document.createElement("div");
    menu.className = "quote-filter-menu";
    options.filter(Boolean).forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        input.value = option;
        menu.remove();
      });
      menu.appendChild(button);
    });
    var rect = wrapper.getBoundingClientRect();
    menu.style.left = rect.left + "px";
    menu.style.top = rect.bottom + 2 + "px";
    menu.style.width = rect.width + "px";
    document.body.appendChild(menu);
  }

  function toggleExpansion(row) {
    var id = row.dataset.quoteId;
    var existing = document.querySelector('tr[data-expanded-for="' + id + '"]');
    if (existing) {
      existing.remove();
      return;
    }
    document.querySelectorAll("tr[data-expanded-for]").forEach(function (item) { item.remove(); });
    var cells = row.children;
    var expanded = document.createElement("tr");
    expanded.className = "quote-expanded-row";
    expanded.dataset.expandedFor = id;
    expanded.innerHTML = '<td colspan="11"><div class="quote-expanded-card"><span><small>Маршрут</small><b>' + text(cells[2].textContent).replace("Склад Отправителя", "") + " → " + text(cells[3].textContent).replace("Склад клиента/получателя", "") + '</b></span><span><small>Стоимость КП</small><b>' + text(cells[6].textContent) + '</b></span><a href="quote-detail.html?id=' + encodeURIComponent(id) + '">Открыть котировку</a></div></td>';
    row.after(expanded);
  }

  function downloadCsv() {
    var visible = rows.filter(function (row) { return !row.hidden; });
    var values = [["№ запроса", "Дата", "Где забрать", "Куда доставить", "Как везем", "Стоимость КП", "Статус"]];
    visible.forEach(function (row) {
      values.push([row.dataset.quoteId, text(row.children[1].textContent), text(row.children[2].textContent), text(row.children[3].textContent), text(row.children[4].textContent), text(row.children[6].textContent), row.dataset.status]);
    });
    var csv = values.map(function (line) { return line.map(function (value) { return '"' + String(value).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n");
    var link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    link.download = "quotes.csv";
    link.click();
    window.setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
    showToast("Список котировок скачан");
  }

  document.querySelectorAll("a[href]").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.indexOf("lk.optimalog.ru") === -1) return;
    if (href.indexOf("/applications") !== -1) link.href = "requests.html";
    else if (href.indexOf("/declarations") !== -1) link.href = "declarations.html";
    else if (href.indexOf("/documents") !== -1) link.href = "documents.html";
    else if (href.indexOf("/invoices") !== -1) link.href = "invoices.html";
    else link.href = "quotes.html";
  });

  rows.forEach(function (row) {
    row.tabIndex = 0;
    row.addEventListener("click", function (event) {
      if (event.target.closest("a, button, [data-copy-quote]")) return;
      window.location.href = "quote-detail.html?id=" + encodeURIComponent(row.dataset.quoteId);
    });
    row.addEventListener("keydown", function (event) {
      if (event.key === "Enter") window.location.href = "quote-detail.html?id=" + encodeURIComponent(row.dataset.quoteId);
    });
    var copyCell = row.querySelector("[data-copy-quote]");
    if (copyCell) copyCell.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      showToast("Запрос " + row.dataset.quoteId + " скопирован");
    });
    var pair = pairedButtonRow(row);
    if (pair) pair.addEventListener("click", function (event) {
      event.preventDefault();
      toggleExpansion(row);
    });
  });

  document.querySelectorAll(".areal-counter-tags").forEach(function (button) {
    button.addEventListener("click", function () {
      var labelNode = button.querySelector(".areal-counter-tags-content-text");
      activeStatus = text(labelNode && labelNode.textContent) || "Все";
      document.querySelectorAll(".areal-counter-tags").forEach(function (item) { item.classList.remove("areal-counter-tags-active"); });
      button.classList.add("areal-counter-tags-active");
      applyFilters();
    });
  });

  document.querySelectorAll(".areal-native-combobox__wrapper").forEach(function (wrapper) {
    wrapper.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openFilterMenu(wrapper);
    });
  });
  document.addEventListener("click", function () { document.querySelectorAll(".quote-filter-menu").forEach(function (menu) { menu.remove(); }); });

  var findButton = Array.from(document.querySelectorAll(".areal-filter button")).find(function (button) { return text(button.textContent).indexOf("Найти") !== -1; });
  if (findButton) findButton.addEventListener("click", applyFilters);
  document.querySelectorAll(".areal-filter input").forEach(function (input) {
    input.addEventListener("keydown", function (event) { if (event.key === "Enter") applyFilters(); });
  });
  var reset = document.querySelector(".areal-filter__control-group__reset a");
  if (reset) reset.addEventListener("click", function (event) { event.preventDefault(); resetFilters(); });

  Array.from(document.querySelectorAll("button")).filter(function (button) { return text(button.textContent) === "Подать заявку"; }).forEach(function (button) {
    button.addEventListener("click", function () { window.location.href = "quote-new.html"; });
  });
  Array.from(document.querySelectorAll(".table-registry-actions a")).forEach(function (link) {
    var label = text(link.textContent);
    link.addEventListener("click", function (event) {
      event.preventDefault();
      if (label.indexOf("Скачать") !== -1) downloadCsv();
      if (label.indexOf("Настрой") !== -1) showToast("Колонки отображаются как в исходном кабинете");
    });
  });

  var widgetRoot = document.getElementById("support-widget-root");
  if (widgetRoot) {
    widgetRoot.innerHTML = '<button class="exact-chat" type="button"><img src="quote-assets/miniLogo_FFSc.svg" alt=""><span><b>Онлайн-чат</b><small>Мы рядом! Напишите нам</small></span><i aria-hidden="true"></i></button>';
    widgetRoot.querySelector("button").addEventListener("click", function () { showToast("Онлайн-чат доступен только в рабочем кабинете"); });
  }

  acceptance.subscribe(refreshStatuses);
}());
