(function () {
  "use strict";
  var files = window.OPTIMALOG_DOCUMENTS || [];
  var template = document.querySelector("tr[data-doc-id]");
  if (!template || !files.length) return;
  var body = template.parentElement;
  var fragment = document.createDocumentFragment();
  files.forEach(function (file) {
    var row = template.cloneNode(true);
    row.id = "document-row-" + file.id;
    row.dataset.docId = file.id;
    row.dataset.fileName = file.name;
    row.dataset.linkId = file.linkId;
    var cells = row.querySelectorAll("td");
    cells.forEach(function (cell) { cell.classList.add("areal-text-t3"); });
    cells[0].textContent = file.type;
    cells[1].textContent = "";
    var previewable = window.OptimalogFileViewer.canPreview(file);
    var name = document.createElement(previewable ? "button" : "span");
    if (previewable) name.type = "button";
    name.className = "document-name";
    name.textContent = file.name;
    if (previewable) name.addEventListener("click", function () { window.OptimalogFileViewer.open(file); });
    cells[1].appendChild(name);
    cells[2].textContent = file.date;
    var time = document.createElement("div");
    time.className = "areal-text-secondary";
    time.textContent = file.time;
    cells[2].appendChild(time);
    cells[3].textContent = "";
    file.related.forEach(function (item) {
      var line = document.createElement("div");
      var link = document.createElement("a");
      line.appendChild(document.createTextNode(item.label + " "));
      link.className = "areal-link areal-link_size-S";
      link.href = item.url;
      link.textContent = item.text;
      line.appendChild(link);
      cells[3].appendChild(line);
    });
    cells[4].querySelectorAll("a").forEach(function (link) {
      var preview = !!link.querySelector('[aria-labelledby="ShowIcon"]');
      if (preview && !previewable) {
        var disabled = document.createElement("button");
        disabled.type = "button";
        disabled.className = "document-preview-disabled";
        disabled.disabled = true;
        disabled.title = "Просмотр Excel недоступен";
        disabled.setAttribute("aria-label", disabled.title);
        disabled.innerHTML = link.innerHTML;
        link.parentElement.removeAttribute("tabindex");
        link.replaceWith(disabled);
        return;
      }
      link.href = file.url;
      link.title = (preview ? "Посмотреть " : "Скачать ") + file.name;
      link.setAttribute("aria-label", link.title);
      if (preview) link.addEventListener("click", function (event) {
        event.preventDefault();
        window.OptimalogFileViewer.open(file);
      });
      else link.download = file.name;
    });
    fragment.appendChild(row);
  });
  body.replaceChildren(fragment);
  var fields = document.querySelectorAll(".areal-filter input");
  [[fields[0], "document-types", files.map(function (f) { return f.type; })],
   [fields[3], "document-links", files.map(function (f) { return f.linkId; })]].forEach(function (item) {
    if (!item[0]) return;
    var list = document.createElement("datalist");
    list.id = item[1];
    Array.from(new Set(item[2])).forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      list.appendChild(option);
    });
    item[0].setAttribute("list", list.id);
    document.body.appendChild(list);
  });
}());
