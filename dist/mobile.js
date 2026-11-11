(function () {
  "use strict";
  var screen = window.matchMedia("(max-width: 767px)");
  var pending = false;
  var placeholders = new Map();
  var menu = document.getElementById("ol-mobile-more");
  var nav = document.querySelector(".ol-mobile-nav");
  var moreButton = document.querySelector("[data-mobile-more]");
  var backdrop = document.querySelector(".ol-menu-backdrop");
  var menuOpen = false;
  var inertBefore = [];
  var returnFocus = null;
  var eye = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var download = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v13m-6-6 6 6 6-6M4 21h16"/></svg>';
  function compact(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function stopKeys(event) {
    if (event.key === "Enter" || event.key === " ") event.stopPropagation();
  }
  function kindOf(row) {
    if (row.hasAttribute("data-quote-id")) return "quote";
    if (row.hasAttribute("data-request-id")) return "request";
    if (row.hasAttribute("data-declaration-id")) return "declaration";
    if (row.hasAttribute("data-doc-id")) return "document";
    if (row.hasAttribute("data-invoice-id")) return "invoice";
    return "detail";
  }
  function quoteExtras(row, cells) {
    var item = (window.OPTIMALOG_QUOTES || {})[row.dataset.quoteId];
    if (!item || !item.offer || cells.length < 10) return;
    var file = { name: "Коммерческое предложение " + row.dataset.quoteId + ".pdf", url: "assets/commercial-offer-" + row.dataset.quoteId.toLowerCase() + ".pdf" };
    var links = element("div", "ol-quote-files ol-mobile-only");
    var preview = element("button");
    preview.type = "button";
    preview.innerHTML = eye;
    preview.setAttribute("aria-label", "Просмотреть коммерческое предложение");
    preview.addEventListener("click", function (event) {
      event.stopPropagation();
      if (window.OptimalogFileViewer) window.OptimalogFileViewer.open(file);
      else window.location.href = file.url;
    });
    preview.addEventListener("keydown", stopKeys);
    var link = element("a");
    link.href = file.url;
    link.download = file.name;
    link.innerHTML = download;
    link.appendChild(element("span", "", "Скачать КП"));
    link.addEventListener("click", function (event) { event.stopPropagation(); });
    link.addEventListener("keydown", stopKeys);
    links.append(preview, link);
    cells[8].appendChild(links);
    if (item.services && item.services.length) {
      var services = element("details", "ol-quote-services ol-mobile-only");
      services.appendChild(element("summary", "", "Услуги"));
      var list = element("dl");
      var money = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      item.services.forEach(function (service) {
        list.append(element("dt", "", service.name), element("dd", "", money.format(service.amount) + " " + (item.offerCurrency === "EUR" ? "€" : "$")));
      });
      services.appendChild(list);
      services.addEventListener("click", function (event) { event.stopPropagation(); });
      services.addEventListener("keydown", stopKeys);
      cells[7].appendChild(services);
    }
  }
  function decorateTable(table) {
    var head = table.tHead && table.tHead.rows[0];
    if (!head || !table.tBodies.length) return;
    var headings = Array.from(head.cells);
    if (!headings.length) return;
    table.classList.add("ol-card-table");
    Array.from(table.tBodies).forEach(function (body) {
      Array.from(body.rows).forEach(function (row) {
        if (row.dataset.mobileReady || row.classList.contains("areal-table__expansion__button-row")) return;
        var cells = Array.from(row.cells);
        if (!cells.length) return;
        row.dataset.mobileKind = kindOf(row);
        if (cells.length === 1 && cells[0].colSpan > 1) {
          row.classList.add("ol-card-row");
          cells[0].classList.add("ol-card-wide");
          row.dataset.mobileReady = "true";
          return;
        }
        var kind = row.dataset.mobileKind;
        // The desktop quote table has a separate preceding rowspan column.
        var offset = kind === "quote" && headings.length === cells.length + 1 ? 1 : 0;
        var titleIndex = kind === "document" ? 1 : (kind === "request" ? 1 : 0);
        cells.forEach(function (cell, index) {
          var heading = headings[index + offset];
          if (!heading) return;
          var field = (heading.id || "column-" + index).replace(/Header$/, "");
          var label = compact(heading.textContent);
          cell.dataset.mobileField = field;
          if (!label && /expansion|status_type/i.test(field)) {
            cell.classList.add("ol-card-decoration");
            return;
          }
          if (kind === "request" && index === titleIndex) label = "Заявка";
          cell.dataset.mobileLabel = label || "Действия";
          if (index === titleIndex) cell.classList.add("ol-card-title");
          if (/статус/i.test(label)) cell.classList.add("ol-card-status");
          if (/организация|претензионная|груз$|отправитель|трекинг/i.test(label)) cell.classList.add("ol-card-wide");
          if (!label || (/файлы$/i.test(label) && kind !== "document")) cell.classList.add("ol-card-actions");
          if (heading.id) cell.setAttribute("headers", heading.id);
        });
        if (kind === "document") {
          var date = compact(cells[2].textContent).match(/\d{2}\.\d{2}\.\d{4}/);
          if (date) cells[1].dataset.mobileDate = " от " + date[0];
        }
        if (kind === "request") {
          var title = cells[1].querySelector(".areal-text-t2, .areal-text-t3");
          if (title) {
            var icon = element("span", "ol-request-state-icon ol-mobile-only");
            var completed = row.dataset.status === "completed";
            icon.setAttribute("role", "img");
            icon.setAttribute("aria-label", completed ? "Завершена" : "Исполняется");
            icon.style.color = completed ? "#5cb85c" : "#ed6c00";
            icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/>' + (completed ? '<path d="m6 12 4 4 8-8"/>' : '<path d="M12 6v6l4 2"/>') + '</svg>';
            title.insertBefore(icon, title.firstChild);
          }
        }
        if (kind === "quote") {
          quoteExtras(row, cells);
          var copy = cells[9] && cells[9].querySelector("a");
          if (copy) {
            copy.setAttribute("aria-label", "Копировать котировку");
            copy.addEventListener("keydown", function (event) {
              if (!screen.matches || (event.key !== "Enter" && event.key !== " ")) return;
              event.preventDefault(); event.stopPropagation(); copy.click();
            });
          }
        }
        row.classList.add("ol-card-row");
        row.dataset.mobileReady = "true";
      });
    });
  }
  function decorateControls() {
    document.querySelectorAll(".areal-filter input").forEach(function (input) {
      if (placeholders.has(input)) return;
      var col = input.closest(".areal-filter__col");
      var label = col && col.querySelector("label");
      var caption = compact(label && label.textContent);
      placeholders.set(input, input.getAttribute("placeholder"));
      if (caption) {
        input.setAttribute("placeholder", caption);
        if (!input.hasAttribute("aria-label")) input.setAttribute("aria-label", caption);
      }
    });
    document.querySelectorAll(".areal-page-title button").forEach(function (button) {
      if (compact(button.textContent) === "Подать заявку") {
        button.classList.add("ol-create-quote");
        button.setAttribute("aria-label", "Подать заявку");
        button.title = "Подать заявку";
      }
    });
    document.querySelectorAll(".table-registry-actions a").forEach(function (link) {
      var caption = compact(link.textContent);
      if (caption && !link.hasAttribute("aria-label")) link.setAttribute("aria-label", caption);
    });
    document.querySelectorAll(".tracking-show-link").forEach(function (link) {
      if (!link.hasAttribute("aria-label")) link.setAttribute("aria-label", "Показать трекинг");
    });
    document.querySelectorAll(".areal-pagination").forEach(function (pagination) {
      var prev = pagination.querySelectorAll(".areal-pagination-list__prev");
      var next = pagination.querySelectorAll(".areal-pagination-list__next");
      if (prev.length > 1) prev[0].classList.add("ol-pagination-edge");
      if (next.length > 1) next[next.length - 1].classList.add("ol-pagination-edge");
    });

  }
  function refresh() {
    pending = false;
    if (!screen.matches) return;
    document.querySelectorAll(".areal-data-table__wrapper table, .quote-cargo-table, .quote-services-table, .table-shell table").forEach(decorateTable);
    decorateControls();
  }
  function schedule() {
    if (!screen.matches || pending) return;
    pending = true;
    window.requestAnimationFrame(refresh);
  }
  function setMenu(open, focus) {
    if (!menu || !nav || !moreButton || !backdrop || (open && !screen.matches)) return;
    if (open === menuOpen) return;
    menuOpen = open;
    menu.hidden = !open;
    backdrop.hidden = !open;
    document.body.classList.toggle("ol-menu-open", open);
    moreButton.setAttribute("aria-expanded", String(open));
    moreButton.querySelector("[data-mobile-more-label]").textContent = open ? "Свернуть" : "Ещё";
    if (open) {
      returnFocus = document.activeElement;
      menu.appendChild(nav); // Keep all menu controls inside the modal's accessible subtree.
      inertBefore = Array.from(document.querySelectorAll("#app, .ol-mobile-header")).map(function (node) {
        var state = { node: node, inert: node.inert };
        node.inert = true;
        return state;
      });
      if (focus !== false) menu.querySelector("button:not([disabled]), a[href]").focus();
    } else {
      menu.after(nav);
      inertBefore.forEach(function (state) { state.node.inert = state.inert; });
      inertBefore = [];
      if (focus !== false && screen.matches && returnFocus && returnFocus.isConnected) returnFocus.focus();
    }
  }
  if (moreButton) moreButton.addEventListener("click", function () { setMenu(!menuOpen); });
  if (backdrop) backdrop.addEventListener("click", function () { setMenu(false); });
  if (menu) menu.addEventListener("click", function (event) {
    if (event.target.closest("a[href]")) setMenu(false, false);
  });
  document.addEventListener("keydown", function (event) {
    if (!menuOpen) return;
    if (event.key === "Escape") { event.preventDefault(); setMenu(false); }
    if (event.key === "Tab") {
      var focusable = Array.from(menu.querySelectorAll("button:not([disabled]), a[href]"));
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  var info = document.querySelector(".ol-mobile-info");
  if (info) {
    var messages = {
      help: ["Помощь", "Выберите раздел в нижнем меню. Документы и счета находятся в меню «Ещё». Фильтры расположены над списком, файл можно открыть значком глаза или скачать стрелкой."]
    };
    document.querySelectorAll("[data-mobile-info]").forEach(function (button) {
      button.addEventListener("click", function () {
        var content = messages[button.dataset.mobileInfo];
        if (!content) return;
        setMenu(false, false);
        info.querySelector("h2").textContent = content[0];
        info.querySelector("[data-mobile-info-text]").textContent = content[1];
        if (!info.open) info.showModal();
      });
    });
    info.querySelectorAll("button").forEach(function (button) { button.addEventListener("click", function () { info.close(); }); });
    info.addEventListener("click", function (event) { if (event.target === info) info.close(); });
    info.addEventListener("close", function () { if (screen.matches && moreButton) moreButton.focus(); });
  }
  function resized() {
    if (screen.matches) schedule();
    else {
      setMenu(false, false);
      if (info && info.open) info.close();
      placeholders.forEach(function (old, input) {
        if (old == null) input.removeAttribute("placeholder"); else input.setAttribute("placeholder", old);
      });
      placeholders.clear();
    }
  }
  if (screen.addEventListener) screen.addEventListener("change", resized); else screen.addListener(resized);
  var observer = new MutationObserver(schedule);
  var root = document.getElementById("app") || document.querySelector(".areal-main");
  if (root) observer.observe(root, { childList: true, subtree: true });
  refresh();
}());
