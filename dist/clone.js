(function () {
  "use strict";

  const quotes = [
    { id: "Q-2026-001", date: "01.09.2026", from: "Шанхай", to: "Москва", mode: "Авиа", status: "Размещен запрос", linked: "", cost: "—", term: "—", scenario: "Новый запрос без расчета" },
    { id: "Q-2026-002", date: "02.09.2026", from: "Нинбо", to: "Москва", mode: "Море", status: "Принят в работу", linked: "", cost: "—", term: "—", scenario: "Работа менеджера" },
    { id: "Q-2026-003", date: "03.09.2026", from: "Шэньчжэнь", to: "Химки", mode: "ЖД", status: "Запрос акцептован", linked: "A-2026-101", cost: "6 420 USD / 579 083 ₽", term: "18–22 дня", scenario: "Акцептована и связана с заявкой" },
    { id: "Q-2026-004", date: "04.09.2026", from: "Гуанчжоу", to: "Екатеринбург", mode: "Авто", status: "Котировка завершена", linked: "", cost: "5 780 USD / 521 347 ₽", term: "14–18 дней", scenario: "Доступны КП и акцепт" },
    { id: "Q-2026-005", date: "05.09.2026", from: "Стамбул", to: "Москва", mode: "Авиа", status: "Архив", linked: "", cost: "3 190 EUR / 308 954 ₽", term: "5–7 дней", scenario: "Клиент не заинтересован" },
    { id: "Q-2026-006", date: "06.09.2026", from: "Пекин", to: "Новосибирск", mode: "ЖД", status: "Котировка завершена", linked: "", cost: "4 900 USD / 441 931 ₽", term: "16–20 дней", scenario: "Доступно копирование запроса" },
    { id: "Q-2026-007", date: "07.09.2026", from: "Дели", to: "Москва", mode: "Авиа", status: "Отменена", linked: "", cost: "—", term: "—", scenario: "Причина: изменились сроки" },
    { id: "Q-2026-008", date: "08.09.2026", from: "Шанхай", to: "Санкт-Петербург", mode: "Море", status: "Котировка завершена", linked: "", cost: "4 150 USD / 374 297 ₽", term: "28–34 дня", scenario: "Несколько услуг и валют" }
  ];

  const requests = [
    { id: "A-2026-101", date: "04.09.2026", status: "Новая заявка", progress: 0, quote: "Q-2026-003", cargo: "Электронные модули", services: "412 300 ₽", invoices: "220 000 ₽", unpaid: "70 000 ₽", customs: "0 ₽", doneStages: 0 },
    { id: "A-2026-103", date: "05.09.2026", status: "В пути", progress: 55, quote: "Q-2026-003", cargo: "Комплектующие для оборудования", services: "579 083 ₽", invoices: "480 000 ₽", unpaid: "480 000 ₽", customs: "185 000 ₽", doneStages: 4 },
    { id: "A-2026-104", date: "06.09.2026", status: "Таможенное оформление", progress: 75, quote: "Q-2026-004", cargo: "Текстильные материалы", services: "521 347 ₽", invoices: "610 000 ₽", unpaid: "610 000 ₽", customs: "420 000 ₽", doneStages: 5 },
    { id: "A-2026-105", date: "30.08.2026", status: "Завершена", progress: 100, quote: "Q-2026-005", cargo: "Фармацевтическая упаковка", services: "308 954 ₽", invoices: "390 000 ₽", unpaid: "120 000 ₽", customs: "1 250 000 ₽", doneStages: 7 }
  ];

  const declarations = [
    { id: "DT-2026-001", request: "A-2026-104", date: "06.09.2026", status: "Подготовка документов", goods: "1 товар", payments: "0 ₽", paid: "Не начислены" },
    { id: "DT-2026-002", request: "A-2026-104", date: "07.09.2026", status: "Подана", goods: "3 товара", payments: "420 000 ₽", paid: "Ожидает оплаты" },
    { id: "DT-2026-003", request: "A-2026-105", date: "02.09.2026", status: "Выпущена", goods: "5 товаров", payments: "1 250 000 ₽", paid: "Оплачено" },
    { id: "DT-2026-004", request: "A-2026-103", date: "08.09.2026", status: "Выпущена", goods: "2 товара", payments: "318 000 ₽", paid: "Оплачено" },
    { id: "DT-2026-005", request: "A-2026-101", date: "09.09.2026", status: "Проверка сведений", goods: "2 товара", payments: "185 000 ₽", paid: "Частично оплачено" }
  ];

  const invoices = [
    { id: "INV-001", request: "A-2026-101", date: "04.09.2026", due: "12.09.2026", status: "Оплачен", amount: "150 000 ₽", paid: "150 000 ₽", debt: "—" },
    { id: "INV-002", request: "A-2026-105", date: "31.08.2026", due: "08.09.2026", status: "Частично оплачен", amount: "320 000 ₽", paid: "200 000 ₽", debt: "120 000 ₽" },
    { id: "INV-003", request: "A-2026-103", date: "05.09.2026", due: "13.09.2026", status: "Не оплачен", amount: "480 000 ₽", paid: "0 ₽", debt: "480 000 ₽" },
    { id: "INV-004", request: "A-2026-104", date: "06.09.2026", due: "10.09.2026", status: "Не оплачен, претензионная работа", amount: "610 000 ₽", paid: "0 ₽", debt: "610 000 ₽", claimDate: "11.09.2026" },
    { id: "INV-005", request: "A-2026-101", date: "05.09.2026", due: "15.09.2026", status: "Не оплачен", amount: "70 000 ₽", paid: "0 ₽", debt: "70 000 ₽" },
    { id: "INV-006", request: "A-2026-103", date: "05.09.2026", due: "12.09.2026", status: "Оплачен", amount: "99 083 ₽", paid: "99 083 ₽", debt: "—" },
    { id: "INV-007", request: "A-2026-104", date: "07.09.2026", due: "14.09.2026", status: "Оплачен", amount: "85 000 ₽", paid: "85 000 ₽", debt: "—" },
    { id: "INV-008", request: "A-2026-105", date: "01.09.2026", due: "09.09.2026", status: "Оплачен", amount: "70 000 ₽", paid: "70 000 ₽", debt: "—" }
  ];

  const documents = [
    { id: "DOC-001", link: "A-2026-101", name: "Акт реализации", category: "Реализация", date: "04.09.2026", file: "act-a-2026-101.txt" },
    { id: "DOC-002", link: "A-2026-101", name: "Транспортная накладная", category: "Транспортные документы", date: "04.09.2026", file: "waybill-a-2026-101.txt" },
    { id: "DOC-003", link: "A-2026-103", name: "Страховой полис", category: "Страхование", date: "05.09.2026", file: "insurance-a-2026-103.txt" },
    { id: "DOC-004", link: "A-2026-103", name: "Таможенная спецификация", category: "Таможенные документы", date: "06.09.2026", file: "customs-a-2026-103.txt" },
    { id: "DOC-005", link: "A-2026-104", name: "Упаковочный лист", category: "Транспортные документы", date: "06.09.2026", file: "packing-a-2026-104.txt" },
    { id: "DOC-006", link: "A-2026-104", name: "Расчет таможенных платежей", category: "Таможенные документы", date: "07.09.2026", file: "payments-a-2026-104.txt" },
    { id: "DOC-007", link: "A-2026-105", name: "Акт доставки", category: "Реализация", date: "08.09.2026", file: "delivery-a-2026-105.txt" },
    { id: "DOC-008", link: "A-2026-105", name: "Складская расписка", category: "Иное", date: "08.09.2026", file: "warehouse-a-2026-105.txt" },
    { id: "DOC-009", link: "Q-2026-003", name: "Коммерческое предложение", category: "Коммерческое предложение", date: "03.09.2026", file: "assets/commercial-offer-q-2026-003.pdf" },
    { id: "DOC-010", link: "Q-2026-003", name: "Расчет ставки", category: "Иное", date: "03.09.2026", file: "rate-q-2026-003.txt" },
    { id: "DOC-011", link: "Q-2026-004", name: "Коммерческое предложение", category: "Коммерческое предложение", date: "04.09.2026", file: "assets/commercial-offer-q-2026-003.pdf" },
    { id: "DOC-012", link: "Q-2026-008", name: "Перечень услуг", category: "Иное", date: "08.09.2026", file: "services-q-2026-008.txt" }
  ];

  const specification = [
    { name: "Электронные модули", article: "EL-240", code: "8538 90 920 0", quantity: "80 шт.", pack: "4 короба", net: "540 кг", gross: "585 кг", volume: "3,2 м³", cost: "42 000 USD", country: "Китай", status: "Проверено" },
    { name: "Блоки управления", article: "CU-118", code: "8537 10 980 0", quantity: "40 шт.", pack: "4 короба", net: "610 кг", gross: "665 кг", volume: "4,2 м³", cost: "28 000 USD", country: "Китай", status: "Проверено" }
  ];

  const services = [
    ["Международная перевозка", "3 900 USD", "351 702 ₽"],
    ["Терминальная обработка", "420 USD", "37 878 ₽"],
    ["Страхование", "310 USD", "27 967 ₽"],
    ["Таможенное оформление", "95 000 ₽", "95 000 ₽"],
    ["Хранение", "18 000 ₽", "18 000 ₽"],
    ["Перегрузка", "12 500 ₽", "12 500 ₽"],
    ["Доставка по РФ", "36 036 ₽", "36 036 ₽"]
  ];

  const stages = [
    ["Забор груза", "05.09.2026", "05.09.2026"],
    ["Склад консолидации", "06.09.2026", "06.09.2026"],
    ["Отправление", "07.09.2026", "07.09.2026"],
    ["Транзитный пункт", "09.09.2026", "09.09.2026"],
    ["Прибытие в РФ", "12.09.2026", ""],
    ["Таможенное оформление", "14.09.2026", ""],
    ["Доставка", "16.09.2026", ""]
  ];

  const nav = [
    ["quotes", "quotes.html", "Котировки", "quote"],
    ["requests", "requests.html", "Заявки", "request"],
    ["declarations", "declarations.html", "Декларации на товары", "declaration"],
    ["documents", "documents.html", "Документы", "folder"],
    ["invoices", "invoices.html", "Счета", "invoice"]
  ];

  const page = document.body.dataset.page || "quotes";
  const app = document.getElementById("app");
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
  const params = new URLSearchParams(window.location.search);
  const findById = (items, fallback) => items.find((item) => item.id === params.get("id")) || items.find((item) => item.id === fallback) || items[0];

  function icon(name) {
    const paths = {
      quote: '<path d="M7 3h10v4h3v14H4V7h3z"/><path d="M8 11h8M8 15h6"/>',
      request: '<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 4V2h6v2M8 10h8M8 14h8"/>',
      declaration: '<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>',
      folder: '<path d="M3 7h7l2 2h9l-2 11H3z"/><path d="M3 7V5h7l2 2"/>',
      invoice: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v5c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 10v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5M5 15v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4"/>'
    };
    return `<svg class="nav__icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  }

  function activeSection() {
    if (page.startsWith("quote")) return "quotes";
    if (page.startsWith("request")) return "requests";
    if (page.startsWith("declaration")) return "declarations";
    return page;
  }

  function shell(content) {
    const active = activeSection();
    app.innerHTML = `
      <header class="app-header">
        <div class="client-badge"><span class="client-badge__icon">▣</span><span class="client-badge__text">Тестовый клиент<small>Клиент: —</small></span></div>
        <span class="header-icon" aria-label="Уведомления">♧<b>3</b></span>
        <span class="header-icon" aria-label="Приложения">⠿</span>
        <span class="avatar" aria-label="Профиль">Т</span>
      </header>
      <aside class="sidebar">
        <a class="brand" href="quotes.html" aria-label="Optimalog"><span class="brand__ring"></span><span class="brand__toggle">‹</span></a>
        <nav class="nav" aria-label="Основная навигация">
          ${nav.map(([key, href, label, glyph]) => `<a class="nav__item${active === key ? " is-active" : ""}" href="${href}">${icon(glyph)}<span>${label}</span></a>`).join("")}
        </nav>
        <div class="sidebar__bottom"><span class="help">?</span>OPTIMALOG</div>
      </aside>
      <main class="main">${content}</main>
      <div class="toast" role="status" aria-live="polite"></div>`;
  }

  function head(title, subtitle = "", action = "") {
    return `<div class="page-head"><div class="page-head__titles"><h1>${esc(title)}</h1>${subtitle ? `<p class="subtitle">${esc(subtitle)}</p>` : ""}</div>${action}</div>`;
  }

  function tag(status) {
    let cls = "";
    if (/Оплачен|Выпущена|Завершена|акцептован/i.test(status)) cls = " tag--green";
    else if (/Подана|В пути|оформление|Принят/i.test(status)) cls = " tag--blue";
    else if (/Отменена|Не оплачен/i.test(status)) cls = " tag--red";
    else if (/Архив/i.test(status)) cls = " tag--gray";
    return `<span class="tag${cls}">${esc(status)}</span>`;
  }

  function filters(statuses) {
    return `<section class="filter-box"><div class="filter-grid">
      <input class="field" type="search" data-search placeholder="Номер или текст">
      <input class="field" type="text" data-search-extra placeholder="Связанная запись">
      <select class="field" data-status-select><option value="">Все статусы</option>${statuses.map((status) => `<option>${esc(status)}</option>`).join("")}</select>
      <input class="field" type="text" data-search-extra placeholder="Дата">
      <div class="filter-actions"><button class="btn btn--small" data-find>⌕&nbsp; Найти</button><button class="btn btn--small" data-clear>×&nbsp; Очистить</button></div>
    </div></section>`;
  }

  function chips(items) {
    const counts = items.reduce((map, item) => map.set(item.status, (map.get(item.status) || 0) + 1), new Map());
    return `<div class="counter-row"><button class="chip is-active" data-chip="">Все <span>${items.length}</span></button>${[...counts].map(([status, count]) => `<button class="chip" data-chip="${esc(status)}">${esc(status)} <span>${count}</span></button>`).join("")}</div>`;
  }

  function tools() {
    return `<div class="table-tools"><button class="tool-link" data-export>⇩ Скачать</button><button class="tool-link" data-settings>⚙ Настройка</button></div>`;
  }

  function quotesPage() {
    shell(`${head("Котировки", "8 тестовых записей по сценарию демонстрации", '<a class="btn btn--primary" href="quote-new.html">Подать заявку</a>')}
      ${filters([...new Set(quotes.map((item) => item.status))])}${chips(quotes)}${tools()}
      <div class="table-shell"><table><thead><tr><th>№ запроса</th><th>Дата запроса</th><th>Где забрать</th><th>Куда доставить</th><th>Как везем</th><th>Стоимость КП</th><th>Срок</th><th>Статус КП</th><th>Заявка</th></tr></thead><tbody>
      ${quotes.map((item) => `<tr tabindex="0" data-record data-status="${esc(item.status)}" data-href="quote-detail.html?id=${esc(item.id)}"><td><a href="quote-detail.html?id=${esc(item.id)}">${esc(item.id)}</a></td><td>${esc(item.date)}</td><td class="route">${esc(item.from)}<small>Склад отправителя</small></td><td class="route">${esc(item.to)}<small>Склад клиента</small></td><td>${esc(item.mode)}</td><td>${esc(item.cost)}</td><td>${esc(item.term)}</td><td>${tag(item.status)}</td><td>${item.linked ? `<a href="request-detail.html?id=${esc(item.linked)}">${esc(item.linked)}</a>` : "—"}</td></tr>`).join("")}
      </tbody></table></div>`);
  }

  function requestsPage() {
    shell(`${head("Заявки", "4 тестовые заявки без лишних записей")}${filters([...new Set(requests.map((item) => item.status))])}${chips(requests)}${tools()}
      <div class="table-shell"><table><thead><tr><th>№ заявки</th><th>Дата</th><th>Грузоотправитель</th><th>Маршрут</th><th>Статус</th><th>Прогресс</th><th>Связанная котировка</th></tr></thead><tbody>
      ${requests.map((item) => `<tr tabindex="0" data-record data-status="${esc(item.status)}" data-href="request-detail.html?id=${esc(item.id)}"><td><a href="request-detail.html?id=${esc(item.id)}">${esc(item.id)}</a></td><td>${esc(item.date)}</td><td>тест</td><td>Шанхай → Москва</td><td>${tag(item.status)}</td><td><div class="progress">${item.progress}%<div class="progress__bar"><span style="width:${item.progress}%"></span></div></div></td><td><a href="quote-detail.html?id=${esc(item.quote)}">${esc(item.quote)}</a></td></tr>`).join("")}
      </tbody></table></div>`);
  }

  function declarationsPage() {
    shell(`${head("Декларации на товары", "5 тестовых деклараций")}${filters([...new Set(declarations.map((item) => item.status))])}${chips(declarations)}${tools()}
      <div class="table-shell"><table><thead><tr><th>№ ДТ</th><th>Заявка</th><th>Дата</th><th>Статус ТО</th><th>Номенклатура</th><th>Платежи</th><th>Статус оплаты</th></tr></thead><tbody>
      ${declarations.map((item) => `<tr tabindex="0" data-record data-status="${esc(item.status)}" data-href="declaration-detail.html?id=${esc(item.id)}"><td><a href="declaration-detail.html?id=${esc(item.id)}">${esc(item.id)}</a></td><td><a href="request-detail.html?id=${esc(item.request)}">${esc(item.request)}</a></td><td>${esc(item.date)}</td><td>${tag(item.status)}</td><td>${esc(item.goods)}</td><td>${esc(item.payments)}</td><td>${esc(item.paid)}</td></tr>`).join("")}
      </tbody></table></div>`);
  }

  function documentsPage() {
    const statuses = [...new Set(documents.map((item) => item.category))];
    shell(`${head("Документы", "12 тестовых документов")}${filters(statuses)}${tools()}
      <div class="table-shell"><table><thead><tr><th>№</th><th>Название</th><th>Заявка / котировка</th><th>Категория</th><th>Дата</th><th>Действия</th></tr></thead><tbody>
      ${documents.map((item) => `<tr data-record data-status="${esc(item.category)}"><td>${esc(item.id)}</td><td>${esc(item.name)}</td><td>${esc(item.link)}</td><td>${esc(item.category)}</td><td>${esc(item.date)}</td><td class="nowrap"><button class="btn btn--small" data-view-document="${esc(item.id)}">Просмотр</button> <button class="btn btn--small" data-download-document="${esc(item.id)}">Скачать</button></td></tr>`).join("")}
      </tbody></table></div>`);
  }

  function invoicesPage() {
    shell(`${head("Счета", "8 тестовых счетов")}${filters([...new Set(invoices.map((item) => item.status))])}${chips(invoices)}${tools()}
      <div class="table-shell"><table><thead><tr><th>№ счета</th><th>Заявка</th><th>Дата</th><th>Оплатить до</th><th>Статус</th><th>Сумма</th><th>Оплачено</th><th>Задолженность</th></tr></thead><tbody>
      ${invoices.map((item) => `<tr tabindex="0" data-record data-status="${esc(item.status)}" data-detail="invoice" data-id="${esc(item.id)}"><td><a href="#${esc(item.id)}">${esc(item.id)}</a></td><td><a href="request-detail.html?id=${esc(item.request)}">${esc(item.request)}</a></td><td>${esc(item.date)}</td><td>${esc(item.due)}</td><td>${tag(item.status)}</td><td>${esc(item.amount)}</td><td>${esc(item.paid)}</td><td>${esc(item.debt)}</td></tr>`).join("")}
      </tbody></table></div>`);
  }

  function quoteDetailPage() {
    const item = findById(quotes, "Q-2026-003");
    const related = item.linked || (item.id === "Q-2026-003" ? "A-2026-101" : "");
    shell(`${head(`Котировка ${item.id} от ${item.date}`, item.scenario, '<a class="btn" href="quotes.html">← К списку</a>')}
      <div class="summary"><section class="summary__box"><h2>Маршрут и груз</h2><p><span class="muted">Маршрут:</span> ${esc(item.from)} → ${esc(item.to)}</p><p><span class="muted">Как везем:</span> ${esc(item.mode)}</p><p><span class="muted">Груз:</span> электроника, 8 мест, 1 250 кг, 7,4 м³</p><p><span class="muted">Плановый срок:</span> ${esc(item.term === "—" ? "18–22 дня" : item.term)}</p><p>${tag(item.status)}</p></section>
      <section class="summary__box"><h2>Стоимость</h2><p class="total">${esc(item.cost === "—" ? "6 420 USD" : item.cost.split(" / ")[0])}</p><p>Пересчет: ${esc(item.cost.includes(" / ") ? item.cost.split(" / ")[1] : "579 083 ₽")}</p><p class="muted">Курс зафиксирован для демонстрации</p></section></div>
      <section class="detail-card"><div class="table-shell"><table><thead><tr><th>Услуга</th><th>Валюта</th><th>Стоимость</th></tr></thead><tbody>${services.slice(0, 5).map(([name, foreign, rub]) => `<tr><td>${esc(name)}</td><td>${esc(foreign)}</td><td>${esc(rub)}</td></tr>`).join("")}</tbody></table></div></section>
      <div class="action-row"><a class="btn" href="assets/commercial-offer-q-2026-003.pdf" download>⇩ Скачать коммерческое предложение</a><button class="btn btn--primary" data-action="accept">Акцептовать</button><button class="btn btn--danger" data-action="reject">Не заинтересован</button><button class="btn" data-action="copy">Копировать запрос</button>${related ? `<a class="btn" href="request-detail.html?id=${esc(related)}">Перейти в заявку ${esc(related)}</a>` : ""}</div>`);
    document.title = `Котировка ${item.id} — Оптимальная логистика`;
  }

  function requestDetailPage() {
    const item = findById(requests, "A-2026-103");
    const requestInvoices = invoices.filter((invoice) => invoice.request === item.id);
    const requestDocuments = documents.filter((document) => document.link === item.id);
    document.body.classList.add("request-page");
    shell(`<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="requests.html">‹&nbsp; Назад</a><span>Заявки</span><span>${esc(item.id)} от ${esc(item.date)}</span></nav>
      <section class="request-heading"><h1>Заявка ${esc(item.id)} от ${esc(item.date)}</h1><p>Номер заказа клиента —</p><div class="request-status">${tag(item.status)}<span>⌘&nbsp; Трекинг</span></div></section>
      <section class="journey-overview">
        <div class="journey-captions"><div><b>КИТАЙ</b><span>Шанхай (Shanghai)</span><small>Заявка принята в работу<br>Факт ${esc(item.date)}</small></div><div><b>ТРАНЗИТНЫЙ ПУНКТ</b><span>Склад консолидации</span><small>Отправление основного груза<br>План 09.09.2026${item.progress >= 55 ? " · Факт 09.09.2026" : ""}</small></div><div><b>РОССИЯ</b><span>Москва (Moscow)</span><small>Прибытие и выгрузка<br>План 16.09.2026</small></div></div>
        <div class="journey-track"><span class="journey-progress" style="width:${item.progress}%"></span><i class="journey-node journey-node--start">А</i><i class="journey-node journey-node--middle"></i><i class="journey-node journey-node--end">Б</i></div>
        <div class="journey-links"><span></span><button data-tab-jump="services">Показать</button><button data-tab-jump="files">Показать</button></div>
      </section>
      <section class="request-card"><div class="request-options"><span><b>Как везем</b> АВТО</span><span><b>Условия поставки</b> EXW</span></div><div class="request-places"><div class="place"><span class="place__eyebrow">Где забрать</span><h2>КИТАЙ, Шанхай (Shanghai)</h2><p>Склад Отправителя</p><div class="contact"><span class="contact__label">Грузоотправитель</span><span class="contact__name">тест</span><span>Тестов Тест Тестович</span><span><a href="tel:999-12345678">999-12345678</a> <a href="mailto:test@test.ru">test@test.ru</a></span></div></div><div class="place"><span class="place__eyebrow">Куда доставить</span><h2>РОССИЯ, Москва (Moscow)</h2><p>склад ОЛ</p><p>Склад Отправителя</p><div class="contact"><span class="contact__label">Грузополучатель</span><span class="contact__name">тест</span><span>Тестов Тест Тестович</span><span><a href="tel:999-12345678">999-12345678</a> <a href="mailto:test@test.ru">test@test.ru</a></span></div></div></div><button class="request-collapse" aria-label="Свернуть">⌃</button></section>
      <section class="finance-strip"><div><span>Стоимость услуг</span><b>${esc(item.services)}</b></div><div><span>Сумма счетов</span><b>${esc(item.invoices)}</b></div><div><span>Не оплачено счетов</span><b>${esc(item.unpaid)}</b></div><div><span>Плановые таможенные платежи</span><b>${esc(item.customs)}</b></div></section>
      <section class="tabs"><div class="tab-list" role="tablist"><button class="tab is-active" data-tab="spec">Спецификации <b>2</b></button><button class="tab" data-tab="services">Услуги <b>7</b></button><button class="tab" data-tab="offer">Коммерческое предложение <b>1</b></button><button class="tab" data-tab="request-invoices">Счета <b>${requestInvoices.length}</b></button><button class="tab" data-tab="request-documents">Документы <b>${requestDocuments.length}</b></button><button class="tab" data-tab="related">Заявки <b>1</b></button><button class="tab" data-tab="files">Файлы <b>2</b></button></div>
        <div class="tab-panel" data-panel="spec">${specificationTable()}</div>
        <div class="tab-panel" data-panel="services" hidden>${servicesTable()}</div>
        <div class="tab-panel" data-panel="offer" hidden>${offerPanel()}</div>
        <div class="tab-panel" data-panel="request-invoices" hidden>${invoiceTable(requestInvoices)}</div>
        <div class="tab-panel" data-panel="request-documents" hidden>${documentTable(requestDocuments)}</div>
        <div class="tab-panel" data-panel="related" hidden><p>Связанная котировка: <a href="quote-detail.html?id=${esc(item.quote)}">${esc(item.quote)}</a></p></div>
        <div class="tab-panel" data-panel="files" hidden><div class="action-row"><button class="btn" data-download-text="Описание груза ${esc(item.id)}">Описание груза</button><button class="btn" data-download-text="Упаковочный лист ${esc(item.id)}">Упаковочный лист</button></div></div>
      </section>`);
    document.title = `Заявка ${item.id} — Оптимальная логистика`;
  }

  function specificationTable() {
    return `<div class="table-shell"><table><thead><tr><th>Наименование</th><th>Артикул</th><th>Код ТН ВЭД</th><th>Количество</th><th>Упаковка</th><th>Нетто</th><th>Брутто</th><th>Объем</th><th>Стоимость</th><th>Страна</th><th>Статус ТО</th></tr></thead><tbody>${specification.map((item) => `<tr><td>${esc(item.name)}</td><td>${esc(item.article)}</td><td>${esc(item.code)}</td><td>${esc(item.quantity)}</td><td>${esc(item.pack)}</td><td>${esc(item.net)}</td><td>${esc(item.gross)}</td><td>${esc(item.volume)}</td><td>${esc(item.cost)}</td><td>${esc(item.country)}</td><td>${tag(item.status)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function servicesTable() {
    return `<div class="table-shell"><table><thead><tr><th>Услуга</th><th>Стоимость</th><th>Стоимость в рублях</th></tr></thead><tbody>${services.map(([name, foreign, rub]) => `<tr><td>${esc(name)}</td><td>${esc(foreign)}</td><td>${esc(rub)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function offerPanel() {
    return `<div class="summary"><section class="summary__box"><h2>Итоговая ставка</h2><p class="total">6 420 USD</p><p>579 083 ₽ по демонстрационному курсу</p></section><section class="summary__box"><h2>Файл</h2><a class="btn" href="assets/commercial-offer-q-2026-003.pdf" download>Скачать PDF</a></section></div>`;
  }

  function invoiceTable(items) {
    if (!items.length) return '<div class="empty">Счетов нет</div>';
    return `<div class="table-shell"><table><thead><tr><th>№</th><th>Дата</th><th>Статус</th><th>Сумма</th><th>Оплачено</th><th>Задолженность</th></tr></thead><tbody>${items.map((item) => `<tr data-detail="invoice" data-id="${esc(item.id)}"><td>${esc(item.id)}</td><td>${esc(item.date)}</td><td>${tag(item.status)}</td><td>${esc(item.amount)}</td><td>${esc(item.paid)}</td><td>${esc(item.debt)}</td></tr>`).join("")}</tbody></table></div>`;
  }

  function documentTable(items) {
    if (!items.length) return '<div class="empty">Документов нет</div>';
    return `<div class="table-shell"><table><thead><tr><th>№</th><th>Название</th><th>Категория</th><th>Дата</th><th>Действия</th></tr></thead><tbody>${items.map((item) => `<tr><td>${esc(item.id)}</td><td>${esc(item.name)}</td><td>${esc(item.category)}</td><td>${esc(item.date)}</td><td><button class="btn btn--small" data-view-document="${esc(item.id)}">Просмотр</button> <button class="btn btn--small" data-download-document="${esc(item.id)}">Скачать</button></td></tr>`).join("")}</tbody></table></div>`;
  }

  function declarationDetailPage() {
    const item = findById(declarations, "DT-2026-003");
    const history = [
      ["Создана", "02.09.2026 09:10", "Черновик подготовлен"],
      ["Проверка сведений", "02.09.2026 11:20", "Сведения проверены"],
      ["Подана", "02.09.2026 14:05", "Декларация направлена"],
      ["Оплата платежей", "03.09.2026 10:30", "Платежи подтверждены"],
      ["Выпущена", "03.09.2026 16:40", "Выпуск разрешен"]
    ];
    shell(`${head(`Декларация ${item.id}`, `Заявка ${item.request}`, '<a class="btn" href="declarations.html">← К списку</a>')}
      <section class="detail-card"><div class="detail-grid"><div class="metric"><span class="metric__label">Статус ТО</span><span class="metric__value">${tag(item.status)}</span></div><div class="metric"><span class="metric__label">Товары</span><span class="metric__value">${esc(item.goods)}</span></div><div class="metric"><span class="metric__label">Таможенные платежи</span><span class="metric__value">${esc(item.payments)}</span></div><div class="metric"><span class="metric__label">Оплата</span><span class="metric__value">${esc(item.paid)}</span></div></div></section>
      <h2 class="section-title">Товары</h2>${specificationTable()}
      <h2 class="section-title" style="margin-top:24px">История статусов</h2><div class="table-shell"><table><thead><tr><th>Статус</th><th>Дата</th><th>Комментарий</th></tr></thead><tbody>${history.map(([status, date, comment]) => `<tr><td>${tag(status)}</td><td>${esc(date)}</td><td>${esc(comment)}</td></tr>`).join("")}</tbody></table></div>`);
    document.title = `Декларация ${item.id} — Оптимальная логистика`;
  }

  function quoteNewPage() {
    shell(`${head("Создание новой котировки", "Все данные сохраняются только в рамках демонстрации", '<a class="btn" href="quotes.html">← Отменить</a>')}
      <form class="detail-card" data-quote-form style="padding:22px"><div class="form-grid">
        <div class="form-group"><label>Где забрать</label><input class="form-control" value="КИТАЙ, Шанхай (Shanghai)" required></div>
        <div class="form-group"><label>Куда доставить</label><input class="form-control" value="РОССИЯ, Москва (Moscow)" required></div>
        <div class="form-group"><label>Как везем</label><select class="form-control"><option>АВИА</option><option>АВТО</option><option>ЖД</option><option>МОРЕ</option></select></div>
        <div class="form-group"><label>Условия поставки</label><select class="form-control"><option>EXW</option><option>FCA</option><option>DAP</option></select></div>
        <div class="form-group"><label>Вес, кг</label><input class="form-control" type="number" value="1250" required></div>
        <div class="form-group"><label>Объем, м³</label><input class="form-control" type="number" step="0.1" value="7.4" required></div>
        <div class="form-group form-group--wide"><label>Груз</label><textarea class="form-control">Электроника, 8 мест</textarea></div>
        <div class="form-group form-group--wide"><div class="action-row"><button class="btn btn--primary" type="submit">Отправить</button><a class="btn" href="quotes.html">Отменить</a></div></div>
      </div></form>`);
  }

  function toast(message) {
    const node = document.querySelector(".toast");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 2400);
  }

  function modal(title, body, actions = "") {
    document.querySelector(".modal-backdrop")?.remove();
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `<section class="modal" role="dialog" aria-modal="true"><div class="modal__head"><h2>${esc(title)}</h2><button class="modal__close" aria-label="Закрыть">×</button></div><div class="modal__body">${body}</div>${actions ? `<div class="modal__actions">${actions}</div>` : ""}</section>`;
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop || event.target.closest(".modal__close")) backdrop.remove(); });
    document.body.append(backdrop);
  }

  function applyFilters() {
    const term = [...document.querySelectorAll("[data-search], [data-search-extra]")].map((node) => node.value.trim().toLocaleLowerCase("ru")).filter(Boolean);
    const selected = document.querySelector("[data-status-select]")?.value || document.querySelector(".chip.is-active")?.dataset.chip || "";
    let count = 0;
    document.querySelectorAll("[data-record]").forEach((row) => {
      const matchesText = term.every((value) => row.textContent.toLocaleLowerCase("ru").includes(value));
      const matchesStatus = !selected || row.dataset.status === selected;
      row.hidden = !(matchesText && matchesStatus);
      if (!row.hidden) count += 1;
    });
    toast(`Показано записей: ${count}`);
  }

  function downloadText(name, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = name;
    link.click();
    URL.revokeObjectURL(href);
  }

  function bindInteractions() {
    document.addEventListener("click", (event) => {
      const interactive = event.target.closest("a,button,input,select,textarea,label");
      const row = event.target.closest("[data-href]");
      if (row && !interactive) window.location.href = row.dataset.href;

      const chip = event.target.closest("[data-chip]");
      if (chip) {
        document.querySelectorAll("[data-chip]").forEach((node) => node.classList.remove("is-active"));
        chip.classList.add("is-active");
        const select = document.querySelector("[data-status-select]");
        if (select) select.value = chip.dataset.chip;
        applyFilters();
      }

      if (event.target.closest("[data-find]")) applyFilters();
      if (event.target.closest("[data-clear]")) {
        document.querySelectorAll("[data-search], [data-search-extra]").forEach((node) => { node.value = ""; });
        const select = document.querySelector("[data-status-select]");
        if (select) select.value = "";
        document.querySelectorAll("[data-chip]").forEach((node, index) => node.classList.toggle("is-active", index === 0));
        applyFilters();
      }

      if (event.target.closest("[data-export]")) {
        const table = document.querySelector("table");
        if (!table) return;
        const csv = [...table.querySelectorAll("tr")].filter((rowNode) => !rowNode.hidden).map((rowNode) => [...rowNode.querySelectorAll("th,td")].map((cell) => `"${cell.textContent.trim().replace(/"/g, '""')}"`).join(";")).join("\n");
        downloadText(`${page}.csv`, `\ufeff${csv}`);
        toast("Выгрузка подготовлена");
      }

      if (event.target.closest("[data-settings]")) {
        const headers = [...document.querySelectorAll("table thead th")];
        modal("Настройка таблицы", `<div class="stack">${headers.map((header, index) => `<label><input type="checkbox" data-column="${index}" checked> ${esc(header.textContent.trim())}</label>`).join("")}</div>`, '<button class="btn" data-close-modal>Отмена</button><button class="btn btn--primary" data-apply-columns>Применить</button>');
      }

      if (event.target.closest("[data-close-modal]")) document.querySelector(".modal-backdrop")?.remove();
      if (event.target.closest("[data-apply-columns]")) {
        document.querySelectorAll("[data-column]").forEach((checkbox) => document.querySelectorAll(`table tr > :nth-child(${Number(checkbox.dataset.column) + 1})`).forEach((cell) => { cell.hidden = !checkbox.checked; }));
        document.querySelector(".modal-backdrop")?.remove();
        toast("Настройка применена");
      }

      const tab = event.target.closest("[data-tab]");
      if (tab) {
        document.querySelectorAll("[data-tab]").forEach((node) => node.classList.toggle("is-active", node === tab));
        document.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== tab.dataset.tab; });
      }

      const tabJump = event.target.closest("[data-tab-jump]")?.dataset.tabJump;
      if (tabJump) document.querySelector(`[data-tab="${tabJump}"]`)?.click();

      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action === "accept") toast("Котировка акцептована");
      if (action === "copy") toast("Копия запроса подготовлена");
      if (action === "reject") modal("Причина отказа", '<div class="stack"><label class="radio"><input type="radio" name="reason" checked> Изменились сроки</label><label class="radio"><input type="radio" name="reason"> Изменилась стоимость</label><label class="radio"><input type="radio" name="reason"> Выбран другой маршрут</label><label class="form-group"><span>Комментарий</span><textarea class="form-control" placeholder="Комментарий"></textarea></label></div>', '<button class="btn" data-close-modal>Отмена</button><button class="btn btn--danger" data-confirm-reject>Подтвердить отказ</button>');
      if (event.target.closest("[data-confirm-reject]")) { document.querySelector(".modal-backdrop")?.remove(); toast("Отказ сохранен в демонстрационном режиме"); }

      const docId = event.target.closest("[data-view-document]")?.dataset.viewDocument;
      if (docId) {
        const item = documents.find((document) => document.id === docId);
        if (item?.file.endsWith(".pdf")) window.open(item.file, "_blank", "noopener");
        else if (item) modal(item.name, `<p><b>Связанная запись:</b> ${esc(item.link)}</p><p><b>Категория:</b> ${esc(item.category)}</p><p><b>Дата:</b> ${esc(item.date)}</p><p class="muted">Тестовый документ без персональных данных.</p>`);
      }

      const downloadId = event.target.closest("[data-download-document]")?.dataset.downloadDocument;
      if (downloadId) {
        const item = documents.find((document) => document.id === downloadId);
        if (!item) return;
        if (item.file.endsWith(".pdf")) {
          const link = document.createElement("a"); link.href = item.file; link.download = item.file.split("/").pop(); link.click();
        } else downloadText(item.file, `${item.name}\nСвязанная запись: ${item.link}\nКатегория: ${item.category}\nДата: ${item.date}\n`);
        toast("Файл подготовлен к скачиванию");
      }

      const textFile = event.target.closest("[data-download-text]")?.dataset.downloadText;
      if (textFile) { downloadText(`${textFile.replace(/\s+/g, "-").toLocaleLowerCase("ru")}.txt`, textFile); toast("Файл подготовлен"); }

      const detail = event.target.closest("[data-detail='invoice']");
      if (detail && !event.target.closest("a,button")) {
        const item = invoices.find((invoice) => invoice.id === detail.dataset.id);
        if (item) modal(`Счет ${item.id}`, `<p><b>Заявка:</b> ${esc(item.request)}</p><p><b>Статус:</b> ${esc(item.status)}</p><p><b>Сумма:</b> ${esc(item.amount)}</p><p><b>Задолженность:</b> ${esc(item.debt)}</p>${item.claimDate ? `<hr><p><b>Претензионная работа</b></p><p>Дата начала: ${esc(item.claimDate)}</p>` : ""}`);
      }
    });

    document.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-href]")) { event.preventDefault(); window.location.href = event.target.dataset.href; }
      if (event.key === "Escape") document.querySelector(".modal-backdrop")?.remove();
    });

    document.querySelector("[data-status-select]")?.addEventListener("change", applyFilters);
    document.querySelector("[data-quote-form]")?.addEventListener("submit", (event) => { event.preventDefault(); toast("Запрос отправлен в демонстрационном режиме"); });
  }

  const renderers = {
    quotes: quotesPage,
    requests: requestsPage,
    declarations: declarationsPage,
    documents: documentsPage,
    invoices: invoicesPage,
    "quote-detail": quoteDetailPage,
    "request-detail": requestDetailPage,
    "declaration-detail": declarationDetailPage,
    "quote-new": quoteNewPage
  };

  (renderers[page] || quotesPage)();
  bindInteractions();
})();
