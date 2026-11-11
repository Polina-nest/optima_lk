(function () {
  "use strict";

  var records = {
    "DT-2026-001": {
      customs: "10702070/060926/0001001", request: "A-2026-104", requestDate: "06.09.2026",
      cargo: "Электронные компоненты", weight: "620", volume: "4,2", places: "1 место", cost: "26 000,00 €",
      status: "Готовность к подаче ДТ", arrival: "ВМПТ (коммерческий)", declarationPlace: "Московский ЦЭД", procedure: "ИМ 40",
      timeline: ["06.09.2026 10:20", "—", "—", "—"], clearance: ["—", "Нет", "Нет", "Нет"],
      payments: [["Пошлина", "33 000,00 ₽", "0 ₽"], ["НДС", "145 000,00 ₽", "0 ₽"], ["Сборы", "7 000,00 ₽", "0 ₽"], ["Спец.пошлина", "—", "—"], ["Сумма обеспечения", "—", "—"], ["Итого", "185 000,00 ₽", "0 ₽"]]
    },
    "DT-2026-002": {
      customs: "10702070/070926/0001002", request: "A-2026-104", requestDate: "06.09.2026",
      cargo: "Комплектующие для оборудования", weight: "1 840", volume: "9,6", places: "3 места", cost: "68 000,00 €",
      status: "ДТ подана", arrival: "ВМПТ (коммерческий)", declarationPlace: "Московский ЦЭД", procedure: "ИМ 40",
      timeline: ["07.09.2026 09:10", "07.09.2026 15:45", "—", "—"], clearance: ["08.09.2026", "Да", "Нет", "Нет"],
      payments: [["Пошлина", "76 000,00 ₽", "76 000,00 ₽"], ["НДС", "330 000,00 ₽", "330 000,00 ₽"], ["Сборы", "14 000,00 ₽", "14 000,00 ₽"], ["Спец.пошлина", "—", "—"], ["Сумма обеспечения", "—", "—"], ["Итого", "420 000,00 ₽", "420 000,00 ₽"]]
    },
    "DT-2026-003": {
      customs: "10702070/080926/0001003", request: "A-2026-105", requestDate: "30.08.2026",
      cargo: "Фармацевтическая упаковка", weight: "1 240", volume: "6,8", places: "5 мест", cost: "45 000,00 €",
      status: "ДТ выпущена", arrival: "ВМПТ (коммерческий)", declarationPlace: "Московский ЦЭД", procedure: "ИМ 40",
      timeline: ["08.09.2026 09:30", "08.09.2026 13:15", "09.09.2026 16:40", "10.09.2026 11:20"], clearance: ["09.09.2026", "Да", "Нет", "Нет"],
      payments: [["Пошлина", "450 000,00 ₽", "450 000,00 ₽"], ["НДС", "790 000,00 ₽", "790 000,00 ₽"], ["Сборы", "10 000,00 ₽", "10 000,00 ₽"], ["Спец.пошлина", "—", "—"], ["Сумма обеспечения", "—", "—"], ["Итого", "1 250 000,00 ₽", "1 250 000,00 ₽"]]
    },
    "DT-2026-004": {
      customs: "10702070/090926/0001004", request: "A-2026-103", requestDate: "05.09.2026",
      cargo: "Промышленные датчики", weight: "970", volume: "5,1", places: "2 места", cost: "31 800,00 €",
      status: "ДТ выпущена", arrival: "ВМПТ (коммерческий)", declarationPlace: "Московский ЦЭД", procedure: "ИМ 40",
      timeline: ["09.09.2026 08:45", "09.09.2026 12:05", "10.09.2026 09:20", "10.09.2026 14:10"], clearance: ["10.09.2026", "Да", "Да", "Нет"],
      payments: [["Пошлина", "58 000,00 ₽", "58 000,00 ₽"], ["НДС", "250 000,00 ₽", "250 000,00 ₽"], ["Сборы", "10 000,00 ₽", "10 000,00 ₽"], ["Спец.пошлина", "—", "—"], ["Сумма обеспечения", "—", "—"], ["Итого", "318 000,00 ₽", "318 000,00 ₽"]]
    },
    "DT-2026-005": {
      customs: "10702070/100926/0001005", request: "A-2026-101", requestDate: "04.09.2026",
      cargo: "Электротехнические изделия", weight: "780", volume: "3,9", places: "2 места", cost: "22 500,00 €",
      status: "ДТ подана", arrival: "ВМПТ (коммерческий)", declarationPlace: "Московский ЦЭД", procedure: "ИМ 40",
      timeline: ["10.09.2026 10:10", "10.09.2026 15:30", "—", "—"], clearance: ["—", "Да", "Нет", "Нет"],
      payments: [["Пошлина", "35 000,00 ₽", "0 ₽"], ["НДС", "143 000,00 ₽", "0 ₽"], ["Сборы", "7 000,00 ₽", "0 ₽"], ["Спец.пошлина", "—", "—"], ["Сумма обеспечения", "—", "—"], ["Итого", "185 000,00 ₽", "0 ₽"]]
    }
  };

  var id = new URLSearchParams(location.search).get("id") || "DT-2026-003";
  if (!records[id]) id = "DT-2026-003";
  var record = records[id];
  var fileBase = record.customs.split("/").join("_");
  var files = ["GTD_" + fileBase + ".pdf", "GTD_" + fileBase + ".xml"];
  var eyeIcon = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>';
  var downloadIcon = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"></path></svg>';

  function fileMarkup(name) {
    var url = "declaration-files/" + name;
    return '<div class="declaration-detail-file"><button type="button" data-preview-file data-file-url="' + url + '" data-file-name="' + name + '" aria-label="Просмотреть файл">' + eyeIcon + '</button><button type="button" data-download-file data-file-url="' + url + '" data-file-name="' + name + '" aria-label="Скачать файл">' + downloadIcon + '</button><a href="' + url + '" data-preview-file data-file-name="' + name + '">' + name + '</a></div>';
  }

  function download(name, url) {
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
    closeDocumentDrawer();
    var backdrop = document.createElement("div");
    backdrop.className = "exact-drawer-backdrop";
    var drawer = document.createElement("aside");
    drawer.className = "exact-drawer exact-drawer--document";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.innerHTML = '<header class="exact-drawer__header"><h2 class="exact-drawer__title">' + escapeHtml(name) + '</h2><button type="button" class="exact-drawer__close" aria-label="Закрыть"></button></header><div class="exact-drawer__body"><iframe class="exact-document-frame" title="Просмотр ' + escapeHtml(name) + '"></iframe></div>';
    drawer.querySelector("iframe").src = url.toLowerCase().endsWith(".pdf") ? url + "#toolbar=1&navpanes=0&view=FitH" : url;
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

  document.title = "Декларация " + record.customs + " — Оптимальная логистика";
  var title = document.querySelector("h1");
  var subtitle = document.querySelector("h3");
  if (title) title.textContent = "Декларация " + record.customs;
  if (subtitle) subtitle.innerHTML = 'Заявка <a class="declaration-linked-request" href="request-detail.html?id=' + encodeURIComponent(record.request) + '">' + record.request + '</a> от ' + record.requestDate;

  var infoItems = document.querySelectorAll(".tables-details-declaration1-custom-clearance__diagram__item");
  [record.arrival, record.declarationPlace, record.procedure].forEach(function (value, index) {
    var spans = infoItems[index] && infoItems[index].querySelectorAll(":scope > span");
    if (spans && spans[1]) spans[1].textContent = value;
  });
  if (infoItems[3]) {
    var infoSpans = infoItems[3].querySelectorAll(":scope > span");
    var infoValue = infoSpans[1];
    if (infoValue) {
      infoValue.classList.add("declaration-detail-files");
      infoValue.innerHTML = files.length ? files.map(fileMarkup).join("") : "—";
    }
  }

  document.querySelectorAll(".areal-timeline__item").forEach(function (item, index) {
    var values = item.querySelectorAll(".areal-timeline__item-title > span");
    var completed = record.timeline[index] !== "—";
    if (values[1]) values[1].textContent = record.timeline[index];
    item.classList.toggle("areal-timeline__item--completed", completed);
    item.classList.toggle("areal-timeline__item--line-completed", completed);
    item.classList.toggle("areal-timeline__item--previous-line-completed", completed && index > 0);
    item.classList.toggle("declaration-timeline--inactive", !completed);
  });

  var tables = document.querySelectorAll("table");
  var cargoCells = tables[0].querySelectorAll("tbody td");
  [record.cargo, record.weight, record.volume, record.cost].forEach(function (value, index) {
    if (cargoCells[index]) cargoCells[index].textContent = value;
  });
  var clearanceCells = tables[1].querySelectorAll("tbody td");
  record.clearance.forEach(function (value, index) {
    if (clearanceCells[index]) clearanceCells[index].textContent = value;
  });
  tables[2].querySelectorAll("tbody tr").forEach(function (row, index) {
    var cells = row.querySelectorAll("td");
    (record.payments[index] || []).forEach(function (value, cellIndex) {
      if (cells[cellIndex]) cells[cellIndex].textContent = value;
    });
  });

  var notice = document.querySelector(".declaration-payment-success");
  if (notice) {
    notice.classList.toggle("declaration-payment-success--pending", record.status !== "ДТ выпущена");
    var noticeText = notice.querySelector("small");
    if (noticeText) noticeText.textContent = record.status === "ДТ выпущена" ? "Таможенные платежи оплачены" : "Таможенные платежи рассчитаны";
  }

  var requestRow = tables[3].querySelector("tbody tr");
  if (requestRow) {
    var requestCells = requestRow.querySelectorAll("td");
    var requestLink = requestCells[1] && requestCells[1].querySelector("a");
    var requestDate = requestCells[1] && requestCells[1].querySelector("span");
    if (requestLink) { requestLink.href = "request-detail.html?id=" + encodeURIComponent(record.request); requestLink.textContent = record.request; }
    if (requestDate) requestDate.textContent = record.requestDate;
    if (requestCells[2]) requestCells[2].textContent = "тест";
    if (requestCells[3]) requestCells[3].innerHTML = '<div class="declaration-request-tracking"><div><b>КИТАЙ</b><span>Шанхай (Shanghai)</span><small>Заявка принята в работу<br>Факт ' + record.requestDate + '</small></div><div class="declaration-request-track"><i>А</i><span></span><i>Б</i></div><div><b>РОССИЯ</b><span>Москва (Moscow)</span><small>Прибытие на склад получателя<br>План 15.09.2026</small></div></div>';
  }

  document.querySelectorAll('[role="tab"]').forEach(function (tab) {
    var label = tab.querySelector(".areal-tab__tab__text");
    var counter = tab.querySelector(".areal-counter");
    if (!label || !counter) return;
    if (label.textContent.trim() === "Документы") counter.textContent = String(files.length);
    if (label.textContent.trim() === "Файлы") counter.textContent = String(files.length);
  });

  document.querySelectorAll("a[href]").forEach(function (link) {
    if (link.textContent.trim() === "Назад" || link.textContent.indexOf("Декларации на товары") !== -1) link.href = "declarations.html";
  });
  document.querySelectorAll("[data-download-file]").forEach(function (control) {
    control.addEventListener("click", function (event) {
      event.preventDefault();
      download(control.dataset.fileName, control.dataset.fileUrl);
    });
  });
  document.querySelectorAll("[data-preview-file]").forEach(function (control) {
    control.addEventListener("click", function (event) {
      event.preventDefault();
      openDocumentDrawer(control.dataset.fileUrl || control.getAttribute("href"), control.dataset.fileName);
    });
  });
})();
