(function () {
  "use strict";

  var screen = window.matchMedia("(max-width: 767px)");
  var pending = false;

  function compact(value) { return String(value || "").replace(/\s+/g, " ").trim(); }

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
        if (cells.length === 1 && cells[0].colSpan > 1) {
          row.classList.add("ol-card-row");
          cells[0].classList.add("ol-card-wide");
          row.dataset.mobileReady = "true";
          return;
        }
        // Quote rows share the first desktop column with a preceding rowspan cell.
        var offset = row.hasAttribute("data-quote-id") && headings.length === cells.length + 1 ? 1 : 0;
        var firstContent = true;
        cells.forEach(function (cell, index) {
          var heading = headings[index + offset];
          if (!heading) return;
          var label = compact(heading.textContent);
          var key = heading.id || "";
          if (!label && /expansion|status_type/i.test(key)) {
            var state = { executing: "Исполняется", completed: "Исполнена" }[row.dataset.status];
            if (/status_type/i.test(key) && state) {
              var badge = document.createElement("span");
              badge.className = "ol-mobile-status";
              badge.textContent = state;
              cell.appendChild(badge);
              cell.dataset.mobileLabel = "Статус заявки";
              cell.classList.add("ol-card-status");
            } else if (/status_type/i.test(key) && cell.textContent.trim()) {
              cell.dataset.mobileLabel = "Состояние";
              cell.classList.add("ol-card-status");
            } else cell.classList.add("ol-card-decoration");
            return;
          }
          if (!label) label = "Действия";
          cell.dataset.mobileLabel = label;
          if (firstContent) {
            cell.classList.add("ol-card-title");
            firstContent = false;
          }
          if (/статус/i.test(label)) cell.classList.add("ol-card-status");
          if (/организация|претензионная|груз$|отправитель|трек|файл|документ|заявка-дт/i.test(label)) cell.classList.add("ol-card-wide");
          if (/действия|файлы$/i.test(label)) cell.classList.add("ol-card-actions");
          // Keep an explicit association in addition to the visible mobile caption.
          if (heading.id) cell.setAttribute("headers", heading.id);
        });
        row.classList.add("ol-card-row");
        row.dataset.mobileReady = "true";
      });
    });
  }

  function decorateFilters() {
    document.querySelectorAll(".areal-filter").forEach(function (filter, index) {
      if (filter.dataset.mobileReady) return;
      filter.dataset.mobileReady = "true";
      if (!filter.id) filter.id = "ol-filters-" + index;
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "ol-filter-toggle";
      toggle.textContent = "Фильтры";
      toggle.setAttribute("aria-controls", filter.id);
      toggle.setAttribute("aria-expanded", "false");
      filter.classList.add("ol-filter-collapsed");
      filter.before(toggle);
      function updateCount() {
        var count = Array.from(filter.querySelectorAll("input")).filter(function (input) { return input.value && input.value.trim(); }).length;
        toggle.textContent = count ? "Фильтры · " + count : "Фильтры";
      }
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(open));
        filter.classList.toggle("ol-filter-collapsed", !open);
        if (open) {
          var input = filter.querySelector("input");
          if (input) input.focus({ preventScroll: true });
        }
      });
      filter.addEventListener("input", updateCount);
      filter.addEventListener("change", updateCount);
      filter.addEventListener("click", function () { window.setTimeout(updateCount, 0); });
    });
  }

  function refresh() {
    pending = false;
    if (!screen.matches) return;
    document.querySelectorAll(".areal-data-table__wrapper table, .quote-cargo-table, .quote-services-table, .table-shell table").forEach(decorateTable);
    decorateFilters();
    document.querySelectorAll("[data-copy-quote] a").forEach(function (link) {
      if (!link.hasAttribute("aria-label")) link.setAttribute("aria-label", "Копировать котировку");
    });
  }
  function schedule() {
    if (!screen.matches || pending) return;
    pending = true;
    window.requestAnimationFrame(refresh);
  }
  if (screen.addEventListener) screen.addEventListener("change", schedule);
  else screen.addListener(schedule);
  // Existing renderers replace rows when tabs, filters and local demo state change.
  // Only annotate the original nodes; their handlers and row indices stay intact.
  var observer = new MutationObserver(schedule);
  var root = document.querySelector(".areal-main") || document.getElementById("app");
  if (root) observer.observe(root, { childList: true, subtree: true });
  refresh();
}());
