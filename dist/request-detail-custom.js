(function () {
  "use strict";

  const requests = {
    "A-2026-101": { date: "04.09.2026", status: "ЗАЯВКА ПРИНЯТА В РАБОТУ", doneThrough: 2, dates: ["04.09.2026", "05.09.2026", "06.09.2026", "09.09.2026", "11.09.2026"] },
    "A-2026-103": { date: "05.09.2026", status: "ТАМОЖЕННОЕ ОФОРМЛЕНИЕ", doneThrough: 3, dates: ["05.09.2026", "06.09.2026", "07.09.2026", "10.09.2026", "12.09.2026"] },
    "A-2026-104": { date: "06.09.2026", status: "ГРУЗ ЗАБРАН ОТ ОТПРАВИТЕЛЯ", doneThrough: 2, dates: ["06.09.2026", "07.09.2026", "08.09.2026", "13.09.2026", "15.09.2026"] },
    "A-2026-105": { date: "30.08.2026", status: "ЗАВЕРШЕНА", doneThrough: 4, dates: ["30.08.2026", "31.08.2026", "01.09.2026", "04.09.2026", "06.09.2026"] }
  };

  const specifications = {
    "A-2026-101": [
      { id: "DT-2026-005", customs: "10702070/100926/0001005", cargo: "Электротехнические изделия", measures: ["780 кг", "3,9 м3", "2 места"], fact: "0 ₽", planned: "185 000 ₽", status: "ДТ подана", color: "#ff6b01", files: ["GTD_10702070_100926_0001005.pdf", "GTD_10702070_100926_0001005.xml"] }
    ],
    "A-2026-103": [
      { id: "DT-2026-004", customs: "10702070/090926/0001004", cargo: "Промышленные датчики", measures: ["970 кг", "5,1 м3", "2 места"], fact: "318 000 ₽", planned: "318 000 ₽", status: "ДТ выпущена", color: "#5cb85c", files: ["GTD_10702070_090926_0001004.pdf", "GTD_10702070_090926_0001004.xml"] }
    ],
    "A-2026-104": [
      { id: "DT-2026-001", customs: "10702070/060926/0001001", cargo: "Электронные компоненты", measures: ["620 кг", "4,2 м3", "1 место"], fact: "0 ₽", planned: "185 000 ₽", status: "Готовность к подаче ДТ", color: "#ffaf38", files: ["GTD_10702070_060926_0001001.pdf", "GTD_10702070_060926_0001001.xml"] },
      { id: "DT-2026-002", customs: "10702070/070926/0001002", cargo: "Комплектующие для оборудования", measures: ["1 840 кг", "9,6 м3", "3 места"], fact: "420 000 ₽", planned: "420 000 ₽", status: "ДТ подана", color: "#ff6b01", files: ["GTD_10702070_070926_0001002.pdf", "GTD_10702070_070926_0001002.xml"] }
    ],
    "A-2026-105": [
      { id: "DT-2026-003", customs: "10702070/080926/0001003", cargo: "Фармацевтическая упаковка", measures: ["1 240 кг", "6,8 м3", "5 мест"], fact: "1 250 000 ₽", planned: "1 250 000 ₽", status: "ДТ выпущена", color: "#5cb85c", files: ["GTD_10702070_080926_0001003.pdf", "GTD_10702070_080926_0001003.xml"] }
    ]
  };

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");
  const id = Object.prototype.hasOwnProperty.call(requests, requestedId) ? requestedId : "A-2026-103";
  const request = requests[id];
  const date = request.date;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[character]));
  }

  function trackingSteps() {
    const dates = request.dates;
    return [
      { country: "КИТАЙ", city: "Шанхай (Shanghai)", place: "Склад Отправителя", date: `Факт ${dates[0]}`, event: "Заявка принята в работу", start: true },
      { country: "КИТАЙ", city: "Шанхай (Shanghai)", place: "Склад Отправителя", date: `План ${dates[1]}|Факт ${dates[1]}`, event: "Прибытие и загрузка у Отправителя основной заявки" },
      { country: "КИТАЙ", city: "Шанхай (Shanghai)", place: "Склад Отправителя", date: `План ${dates[2]}|Факт ${dates[2]}`, event: "Выход со склада Отправителя" },
      { country: "РОССИЯ", city: "Владивосток (Vladivostok)", place: "Морской порт назначения", date: `План ${dates[3]}`, event: "Прибытие в порт назначения" },
      { country: "РОССИЯ", city: "Москва (Moscow)", place: "склад ОЛ Склад Отправителя", date: `План ${dates[4]}`, event: "Прибытие на склад получателя" }
    ].map((step, index) => ({ ...step, done: index <= request.doneThrough }));
  }

  function closeDrawer() {
    const backdrop = document.querySelector(".exact-drawer-backdrop");
    const drawer = document.querySelector(".exact-drawer");
    backdrop?.classList.remove("is-open");
    drawer?.classList.remove("is-open");
    document.body.classList.remove("exact-drawer-open");
    setTimeout(() => {
      backdrop?.remove();
      drawer?.remove();
    }, 210);
  }

  function openDrawer({ title, subtitle = "", type = "tracking", content }) {
    closeDrawer();
    const backdrop = document.createElement("div");
    backdrop.className = "exact-drawer-backdrop";
    const drawer = document.createElement("aside");
    drawer.className = `exact-drawer exact-drawer--${type}`;
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.innerHTML = `<header class="exact-drawer__header"><h2 class="exact-drawer__title">${escapeHtml(title)}</h2>${subtitle ? `<div class="exact-drawer__subtitle">${escapeHtml(subtitle)}</div>` : ""}<button type="button" class="exact-drawer__close" aria-label="Закрыть"></button></header><div class="exact-drawer__body"></div>`;
    drawer.querySelector(".exact-drawer__body").appendChild(content);
    document.body.append(backdrop, drawer);
    backdrop.addEventListener("click", closeDrawer);
    drawer.querySelector(".exact-drawer__close").addEventListener("click", closeDrawer);
    document.body.classList.add("exact-drawer-open");
    requestAnimationFrame(() => {
      backdrop.classList.add("is-open");
      drawer.classList.add("is-open");
      drawer.querySelector(".exact-drawer__close").focus();
    });
  }

  function openTrackingDrawer() {
    const list = document.createElement("div");
    list.className = "exact-tracking-list";
    list.innerHTML = trackingSteps().map((step) => `
      <div class="exact-tracking-step${step.done ? " is-done" : ""}${step.start ? " is-start" : ""}">
        <div class="exact-tracking-step__place"><strong>${escapeHtml(step.country)} ${escapeHtml(step.city)}</strong><span>${escapeHtml(step.place)}</span></div>
        <div class="exact-tracking-step__axis"><span class="exact-tracking-step__marker">${step.start ? "A" : step.done ? "✓" : ""}</span></div>
        <div class="exact-tracking-step__date">${step.date.split("|").map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>
        <div class="exact-tracking-step__event"><span>${escapeHtml(step.event)}</span></div>
      </div>`).join("");
    openDrawer({ title: "Трекинг", subtitle: `Заявка ${id} от ${date}`, content: list });
  }

  function openDocumentDrawer(url, name) {
    const frame = document.createElement("iframe");
    frame.className = "exact-document-frame";
    frame.title = `Просмотр ${name}`;
    frame.src = url.toLowerCase().endsWith(".pdf") ? `${url}#toolbar=1&navpanes=0&view=FitH` : url;
    openDrawer({ title: name, type: "document", content: frame });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.querySelector(".exact-drawer.is-open")) closeDrawer();
  });

  function replaceText(root, source, replacement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.nodeValue.includes(source)) node.nodeValue = node.nodeValue.split(source).join(replacement);
    });
  }

  replaceText(document.body, "DTK017186", id);
  replaceText(document.body, "26.11.2025", date);
  replaceText(document.body, "ГРУЗ ЗАБРАН ОТ ОТПРАВИТЕЛЯ", request.status);
  document.title = `Заявка ${id} от ${date} — Оптимальная логистика`;

  const table = document.querySelector(".areal-tabs-window table");
  const tbody = table?.querySelector("tbody");
  const specs = specifications[id] || [];
  const fileIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v12m0 0 5-5m-5 5-5-5M5 20h14"></path></svg>';
  const eyeIcon = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>';

  function specificationFiles(spec) {
    return spec.files.map((name) => {
      const url = `declaration-files/${name}`;
      return `<div class="request-spec-file"><a href="${url}" data-spec-preview="${name}" aria-label="Просмотреть файл">${eyeIcon}</a><button type="button" data-spec-download="${name}" data-file-url="${url}" aria-label="Скачать файл">${fileIcon}</button><a href="${url}" data-spec-preview="${name}">${name}</a></div>`;
    }).join("");
  }

  if (tbody) {
    tbody.innerHTML = specs.map((spec) => `
      <tr class="areal-table__row request-spec-row" data-spec-id="${spec.id}">
        <td class="areal-table__row__item areal-table__row__item_link"><div class="d-flex flex-column gy-1"><a href="declaration-detail.html?id=${encodeURIComponent(spec.id)}" class="areal-text-t3 medium">${id} от ${date}</a><span class="areal-text-caption1">${spec.customs}</span></div></td>
        <td class="areal-table__row__item"><div class="d-flex flex-column align-end">${spec.measures.map((value) => `<span>${value}</span>`).join("")}</div></td>
        <td class="areal-table__row__item"><span>${spec.cargo}</span></td>
        <td class="areal-table__row__item text-right"><span>${spec.fact}</span></td>
        <td class="areal-table__row__item text-right"><span>${spec.planned}</span>${spec.status === "ДТ выпущена" ? '<small class="request-spec-paid">Оплачено</small>' : ""}</td>
        <td class="areal-table__row__item"><div class="request-spec-status"><span style="--spec-status:${spec.color}">${spec.status}</span>${specificationFiles(spec)}</div></td>
      </tr>`).join("");
  }

  document.querySelectorAll('[role="tab"]').forEach((tab) => {
    const label = tab.querySelector(".areal-tab__tab__text");
    const counter = tab.querySelector(".areal-counter");
    if (label?.textContent.trim() === "Спецификации" && counter) counter.textContent = String(specs.length);
  });

  document.querySelectorAll("[data-spec-download]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const name = control.dataset.specDownload;
      const link = document.createElement("a");
      link.href = control.dataset.fileUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  document.querySelectorAll("[data-spec-preview]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openDocumentDrawer(control.getAttribute("href"), control.dataset.specPreview);
    });
  });

  document.querySelectorAll(".request-spec-row").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("a,button")) return;
      location.href = `declaration-detail.html?id=${encodeURIComponent(row.dataset.specId)}`;
    });
  });

  const destinations = [
    ["/lkk/quotes", "quotes.html"],
    ["/lkk/applications", "requests.html"],
    ["/lkk/declarations", "declarations.html"],
    ["/lkk/documents", "documents.html"],
    ["/lkk/invoices", "invoices.html"],
    ["/lkk/", "quotes.html"]
  ];

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (/^(?:index|quotes|quote-detail|quote-new|requests|request-detail|declarations|declaration-detail|documents|invoices)\.html(?:[?#]|$)/.test(href)) return;
    if (href.startsWith("tel:") || href.startsWith("mailto:")) return;
    if (href.startsWith("declaration-files/")) return;
    if (href.startsWith("declaration-detail.html") || href.startsWith("request-detail.html")) return;
    if (link.classList.contains("areal-tab__link")) {
      const sourceUrl = new URL(href, window.location.href);
      link.href = `request-detail.html?id=${encodeURIComponent(id)}#${sourceUrl.searchParams.get("tab") || "declarations"}`;
      return;
    }
    const match = destinations.find(([source]) => href.includes(source));
    link.href = match ? match[1] : "#";
  });

  const tabs = Array.from(document.querySelectorAll(".areal-tab__link"));
  const slider = document.querySelector(".areal-tabs-slider-wrapper");
  tabs.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      tabs.forEach((tabLink) => {
        const tab = tabLink.querySelector('[role="tab"]');
        const active = tabLink === link;
        tab?.classList.toggle("areal-tab__tab--active", active);
        tab?.setAttribute("aria-selected", String(active));
      });
      const tab = link.querySelector('[role="tab"]');
      if (slider && tab) {
        slider.style.left = `${link.offsetLeft}px`;
        slider.style.width = `${tab.offsetWidth}px`;
      }
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  const timeline = document.querySelector(".areal-tracking-timeline");
  const timelineTitles = timeline ? Array.from(timeline.querySelectorAll(".areal-tracking-timeline__wrapper:first-child .areal-tracking-timeline__item-title")) : [];
  const routeSteps = trackingSteps();
  [routeSteps[0], routeSteps[3], routeSteps[4]].forEach((step, index) => {
    if (!timelineTitles[index]) return;
    const dateLines = step.date.split("|").map((value) => `<span class="areal-text-caption1 medium gray--text text--darken1">${escapeHtml(value)}</span>`).join("");
    timelineTitles[index].innerHTML = `<span class="areal-text-t4 medium">${escapeHtml(step.country)}</span><span class="areal-text-t4 medium">${escapeHtml(step.city)}</span><div class="d-flex flex-column mt-1"><span class="areal-text-caption1 medium gray--text text--darken1">${escapeHtml(step.event)}</span>${dateLines}</div>`;
  });

  Array.from(document.querySelectorAll("a")).filter((link) => {
    const label = link.textContent.trim();
    return label === "Показать" || label === "Трекинг";
  }).forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openTrackingDrawer();
    });
  });

  const financeItems = document.querySelectorAll(".tables-details-request1-page__finance__item");
  const plannedTotal = specs.reduce((sum, spec) => sum + Number(spec.planned.replace(/\D/g, "")), 0);
  const plannedValues = financeItems[3]?.querySelectorAll(".d-flex.flex-column span");
  if (plannedValues?.length) {
    plannedValues[0].textContent = "—";
    plannedValues[1].textContent = `${new Intl.NumberFormat("ru-RU").format(plannedTotal)} ₽`;
  }

  const collapse = document.querySelector(".tables-details-request1-page__diagrams > .areal-nav-toggle__tooltip__wrapper");
  const places = document.querySelector(".tables-details-request1-page__diagrams__places");
  const divider = document.querySelector(".tables-details-request1-page__diagrams > .areal-divider");
  collapse?.addEventListener("click", () => {
    const hidden = places?.hasAttribute("hidden");
    if (places) places.toggleAttribute("hidden", !hidden);
    if (divider) divider.toggleAttribute("hidden", !hidden);
    collapse.querySelector("svg")?.style.setProperty("transform", hidden ? "rotate(90deg)" : "rotate(-90deg)");
  });
})();
