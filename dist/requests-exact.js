(function () {
  "use strict";

  const rows = Array.from(document.querySelectorAll("tr[data-request-id]"));
  const records = rows.map((row) => ({
    row,
    id: row.dataset.requestId,
    status: row.dataset.status
  }));

  const trackingRecords = {
    "A-2026-103": {
      date: "05.09.2026",
      events: [
        ["КИТАЙ", "Шанхай (Shanghai)", "Склад Отправителя", "Факт 05.09.2026", "Заявка принята в работу", "done", "start"],
        ["КИТАЙ", "Шанхай (Shanghai)", "Склад Отправителя", "План 06.09.2026|Факт 06.09.2026", "Прибытие и загрузка у Отправителя", "done"],
        ["КИТАЙ", "Шанхай (Shanghai)", "Морской порт", "План 07.09.2026|Факт 07.09.2026", "Выход из Порта Отправления", "done"],
        ["РОССИЯ", "Владивосток (Vladivostok)", "Морской порт", "План 11.09.2026", "Прибытие в Порт Назначения", "current"],
        ["РОССИЯ", "Москва (Moscow)", "Склад ОЛ", "План 16.09.2026", "Прибытие на Склад Получателя", "future"]
      ]
    },
    "A-2026-104": {
      date: "06.09.2026",
      events: [
        ["КИТАЙ", "Шанхай (Shanghai)", "Склад Отправителя", "Факт 06.09.2026", "Заявка принята в работу", "done", "start"],
        ["КИТАЙ", "Шанхай (Shanghai)", "Склад Отправителя", "План 07.09.2026|Факт 07.09.2026", "Прибытие и загрузка у Отправителя", "done"],
        ["КИТАЙ", "Шанхай (Shanghai)", "Морской порт", "План 08.09.2026|Факт 08.09.2026", "Заявка загружена в ТС", "done"],
        ["КИТАЙ", "Шанхай (Shanghai)", "Морской порт", "План 09.09.2026|Факт 09.09.2026", "Выход из Порта Отправления", "done"],
        ["РОССИЯ", "Владивосток (Vladivostok)", "Морской порт", "План 10.09.2026|Факт 10.09.2026", "Прибытие в Порт Назначения", "done"],
        ["РОССИЯ", "Владивосток (Vladivostok)", "Таможенный пост", "План 11.09.2026|Факт 11.09.2026", "Прибытие на таможню назначения", "done"],
        ["РОССИЯ", "Владивосток (Vladivostok)", "Таможенный пост", "План 11.09.2026", "Выход с Таможни Назначения", "current"],
        ["РОССИЯ", "Москва (Moscow)", "Склад ОЛ", "План 14.09.2026", "Выгрузка на Станции Назначения", "future"]
      ]
    }
  };

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
    const match = destinations.find(([source]) => href.includes(source));
    link.href = match ? match[1] : "#";
  });

  function eventMarkup(event) {
    const [country, city, place, dates, description, state, kind] = event;
    const dateLines = dates.split("|").map((line) => `<span>${line}</span>`).join("");
    const marker = kind === "start" ? "A" : "✓";
    return `<article class="tracking-drawer__event tracking-drawer__event--${state}">
      <div class="tracking-drawer__place"><strong>${country}</strong><b>${city}</b><span>${place}</span></div>
      <div class="tracking-drawer__rail"><i class="tracking-drawer__marker ${kind === "start" ? "tracking-drawer__marker--start" : ""}">${marker}</i></div>
      <div class="tracking-drawer__dates">${dateLines}</div>
      <div class="tracking-drawer__description">${description}</div>
    </article>`;
  }

  function closeTracking() {
    const drawer = document.querySelector(".tracking-drawer-backdrop");
    if (!drawer) return;
    drawer.classList.remove("is-open");
    document.body.classList.remove("tracking-drawer-open");
    window.setTimeout(() => drawer.remove(), 180);
  }

  function openTracking(id) {
    const record = trackingRecords[id];
    if (!record) return;
    closeTracking();
    const backdrop = document.createElement("div");
    backdrop.className = "tracking-drawer-backdrop";
    backdrop.innerHTML = `<aside class="tracking-drawer" role="dialog" aria-modal="true" aria-labelledby="tracking-title">
      <header class="tracking-drawer__header">
        <div><h2 id="tracking-title">Трекинг</h2><p>Заявка ${id} от ${record.date}</p></div>
        <button type="button" class="tracking-drawer__close" aria-label="Закрыть">×</button>
      </header>
      <div class="tracking-drawer__line"></div>
      <section class="tracking-drawer__events">${record.events.map(eventMarkup).join("")}</section>
    </aside>`;
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeTracking(); });
    backdrop.querySelector(".tracking-drawer__close").addEventListener("click", closeTracking);
    document.body.appendChild(backdrop);
    document.body.classList.add("tracking-drawer-open");
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    backdrop.querySelector(".tracking-drawer__close").focus();
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTracking();
  });

  ["A-2026-103", "A-2026-104"].forEach((id) => {
    const row = document.querySelector(`tr[data-request-id="${id}"]`);
    if (!row) return;
    let links = Array.from(row.querySelectorAll("a")).filter((link) => link.textContent.trim() === "Показать");
    if (!links.length) {
      const timeline = row.querySelector(".areal-tracking-timeline") || row.querySelector("td:last-child");
      const link = document.createElement("button");
      link.type = "button";
      link.className = "tracking-show-link";
      link.textContent = "Показать";
      timeline.appendChild(link);
      links = [link];
    }
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openTracking(id);
      });
    });
  });

  records.forEach(({ row, id }) => {
    const open = () => { window.location.href = `request-detail.html?id=${encodeURIComponent(id)}`; };
    row.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      event.preventDefault();
      open();
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });

  const counterButtons = Array.from(document.querySelectorAll(".areal-counter-tags"));
  const counters = ["4", "3", "1"];
  counterButtons.forEach((button, index) => {
    const counter = button.querySelector(".areal-counter-tags-notifications");
    if (counter && counters[index]) counter.textContent = counters[index];
  });

  let activeStatus = "all";
  const requestInput = document.querySelector('input[id^="input-"]');

  function filterRows() {
    const query = (requestInput?.value || "").trim().toLocaleLowerCase("ru");
    records.forEach(({ row, status }) => {
      const statusMatch = activeStatus === "all" || status === activeStatus;
      const textMatch = !query || row.textContent.toLocaleLowerCase("ru").includes(query);
      row.hidden = !(statusMatch && textMatch);
    });
  }

  counterButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activeStatus = index === 1 ? "executing" : index === 2 ? "completed" : "all";
      counterButtons.forEach((candidate) => candidate.classList.toggle("areal-counter-tags-active", candidate === button));
      filterRows();
    });
  });

  const buttons = Array.from(document.querySelectorAll("button"));
  buttons.find((button) => button.textContent.trim() === "Найти")?.addEventListener("click", filterRows);
  requestInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") filterRows();
  });

  const reset = document.querySelector(".areal-filter__control-group__reset a");
  reset?.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".areal-filter input").forEach((input) => { input.value = ""; });
    activeStatus = "all";
    counterButtons.forEach((button, index) => button.classList.toggle("areal-counter-tags-active", index === 0));
    filterRows();
  });

  function showToast(message) {
    let toast = document.querySelector(".exact-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "exact-toast";
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  document.querySelectorAll(".table-registry-actions .areal-link").forEach((link) => {
    const label = link.textContent.trim();
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (label === "Скачать") {
        const lines = ["Номер;Дата;Отправитель", ...records.map(({ row, id }) => {
          const values = row.textContent.replace(/\s+/g, " ").trim();
          const date = values.match(/\d{2}\.\d{2}\.\d{4}/)?.[0] || "";
          return `${id};${date};тест`;
        })];
        const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "Заявки.csv";
        anchor.click();
        URL.revokeObjectURL(url);
      } else {
        showToast("Настройка таблицы доступна в демонстрационном режиме");
      }
    });
  });

  const supportRoot = document.getElementById("support-widget-root");
  if (supportRoot) {
    supportRoot.innerHTML = '<button class="exact-chat" type="button"><img src="request-list-assets/miniLogo_2nd3.svg" alt=""><span><b>Онлайн-чат</b><small>Мы рядом! Напишите нам</small></span><i></i></button>';
    supportRoot.querySelector("button")?.addEventListener("click", () => showToast("Онлайн-чат недоступен в версии без бэкенда"));
  }
})();
