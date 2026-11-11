(function () {
  "use strict";

  var QUOTES = window.OPTIMALOG_QUOTES;

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

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function downloadRate(id, item) {
    var content = "Котировка;" + id + "\nМаршрут;" + item.pickup + " — " + item.delivery + "\nСтоимость;" + item.cost + "\nСрок;18–22 дня";
    var link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" }));
    link.download = "rate-" + id + ".csv";
    link.click();
    window.setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
    showToast("Расчет ставки скачан");
  }

  function openDeclineModal(updateStatus) {
    var backdrop = document.createElement("div");
    backdrop.className = "quote-decline-backdrop";
    backdrop.innerHTML = '<form class="quote-decline-modal"><h2>Причина отказа</h2><label><input type="radio" name="reason" checked> Не устраивает стоимость</label><label><input type="radio" name="reason"> Не устраивают сроки</label><label><input type="radio" name="reason"> Изменились условия поставки</label><label><input type="radio" name="reason"> Другая причина</label><textarea placeholder="Комментарий"></textarea><footer><button type="button" class="quote-action-secondary" data-cancel>Отменить</button><button type="submit" class="quote-action-primary">Подтвердить</button></footer></form>';
    backdrop.querySelector("[data-cancel]").addEventListener("click", function () { backdrop.remove(); });
    backdrop.addEventListener("click", function (event) { if (event.target === backdrop) backdrop.remove(); });
    backdrop.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      updateStatus("Архив", "#989898");
      backdrop.remove();
      showToast("Котировка перенесена в архив");
    });
    document.body.appendChild(backdrop);
  }

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id") || "Q-2026-003";
  var item = QUOTES[id] || QUOTES["Q-2026-003"];
  if (!QUOTES[id]) id = "Q-2026-003";
  var title = "№ " + id + " от " + item.date;
  setText("[data-quote-title]", title);
  setText("[data-breadcrumb-current]", title);
  setText("[data-quote-mode]", item.mode);
  setText("[data-quote-pickup]", item.pickup);
  setText("[data-quote-delivery]", item.delivery);
  setText("[data-cargo-name]", item.cargo);
  setText("[data-cargo-weight]", item.weight);
  setText("[data-cargo-volume]", item.volume);
  setText("[data-cargo-cost]", item.cargoCost);
  setText("[data-cargo-places]", item.places);
  setText("[data-offer-name]", "Коммерческое предложение " + id + ".pdf");
  setText("[data-file-name]", "Расчет ставки " + id + ".xlsx");
  setText("[data-offer-cost]", item.cost);
  setText("[data-quote-incoterms]", item.incoterms);
  setText("[data-offer-date]", item.offerDate || "—");
  setText("[data-offer-valid-until]", item.validUntil || "—");
  setText("[data-archive-offer-cost]", item.cost);
  setText("[data-offer-count]", item.offer ? "1" : "0");

  var offerFile = {
    name: "Коммерческое предложение " + id + ".pdf",
    url: "assets/commercial-offer-" + id.toLowerCase() + ".pdf"
  };
  ["[data-offer-download]", "[data-archive-offer-download]"].forEach(function (selector) {
    var link = document.querySelector(selector);
    if (item.offer) {
      link.href = offerFile.url;
      link.download = offerFile.name;
    } else {
      link.removeAttribute("href");
    }
  });
  var previewButton = document.querySelector("[data-offer-preview]");
  previewButton.disabled = !item.offer;
  previewButton.addEventListener("click", function () {
    if (item.offer) window.OptimalogFileViewer.open(offerFile);
  });
  var servicesBody = document.querySelector("[data-offer-services]");
  var money = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  (item.services || []).forEach(function (service) {
    var row = document.createElement("tr");
    var name = document.createElement("td");
    var cost = document.createElement("td");
    name.textContent = service.name;
    cost.textContent = money.format(service.amount) + " " + (item.offerCurrency === "EUR" ? "€" : "$");
    row.append(name, cost);
    servicesBody.appendChild(row);
  });

  var detailRoot = document.querySelector(".quote-detail-exact");
  var offerPanel = document.querySelector("[data-offer-panel]");
  var archiveOffer = document.querySelector("[data-archive-offer]");
  var emptyPanel = document.querySelector("[data-empty-panel]");
  var rateFile = document.querySelector("[data-rate-file]");
  var emptyFiles = document.querySelector("[data-empty-files]");
  var preferences = document.querySelector("[data-quote-preferences]");
  var temperature = document.querySelector("[data-quote-temperature]");
  var conditions = document.querySelector("[data-quote-conditions]");
  var statusNode = document.querySelector("[data-quote-status]");
  var acceptButton = document.querySelector("[data-accept]");
  var declineButton = document.querySelector("[data-decline]");
  var actionsBar = document.querySelector(".quote-actions-bar");
  var acceptance = window.OptimalogQuoteAcceptance;
  var originalState = { status: item.status, color: item.color };
  var currentState = originalState;
  statusNode.setAttribute("role", "status");
  statusNode.setAttribute("aria-live", "polite");
  function renderStatus(status, color) {
    currentState = { status: status, color: color };
    statusNode.textContent = status;
    statusNode.style.background = color;
    var canAccept = acceptance.canAccept(status);
    var canDecline = acceptance.canDecline(status);
    acceptButton.hidden = !canAccept;
    acceptButton.disabled = !canAccept;
    declineButton.hidden = !canDecline;
    declineButton.disabled = !canDecline;
    actionsBar.hidden = !canAccept && !canDecline;

    var isArchive = status === "Архив";
    detailRoot.classList.toggle("is-archive", isArchive);
    preferences.hidden = isArchive;
    temperature.hidden = isArchive;
    conditions.hidden = !isArchive;
    offerPanel.hidden = !item.offer || isArchive;
    archiveOffer.hidden = !item.offer || !isArchive;
    emptyPanel.hidden = item.offer;
    var hasFiles = item.offer && !isArchive;
    setText("[data-file-count]", hasFiles ? "1" : "0");
    rateFile.hidden = !hasFiles;
    emptyFiles.hidden = hasFiles;
  }
  acceptance.subscribe(function () {
    var state = acceptance.getState(id, originalState);
    renderStatus(state.status, state.color);
  });
  document.title = title + " — Оптимальная логистика";

  document.querySelector("[data-cargo-toggle]").addEventListener("click", function (event) {
    var button = event.currentTarget;
    var content = document.querySelector("[data-cargo-content]");
    content.hidden = !content.hidden;
    button.classList.toggle("is-collapsed", content.hidden);
  });

  document.querySelectorAll("[data-tab]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-tab]").forEach(function (tab) { tab.classList.toggle("is-active", tab === button); });
      document.querySelectorAll("[data-panel]").forEach(function (panel) { panel.hidden = panel.dataset.panel !== button.dataset.tab; });
    });
  });

  document.querySelector("[data-copy-current]").addEventListener("click", function () { showToast("Запрос " + id + " скопирован"); });
  acceptButton.addEventListener("click", function (event) {
    event.preventDefault();
    if (acceptance.accept(id, currentState)) showToast("Запрос акцептован");
  });
  declineButton.addEventListener("click", function () {
    if (!acceptance.canDecline(currentState.status)) return;
    openDeclineModal(function (status, color) {
      if (!acceptance.canDecline(currentState.status)) return;
      originalState = { status: status, color: color };
      acceptance.clear(id);
    });
  });
  var rateButton = document.querySelector("[data-download-rate]");
  if (rateButton) rateButton.addEventListener("click", function () { downloadRate(id, item); });

  var widgetRoot = document.getElementById("support-widget-root");
  if (widgetRoot) widgetRoot.remove();
}());
