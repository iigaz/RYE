// ==UserScript==
// @name        Remove Youtube Embeds - edu.kpfu.ru
// @match       https://edu.kpfu.ru/*
// @grant       none
// @version     2.2
// @author      iigaz
// @icon        https://raw.githubusercontent.com/iigaz/RYE/main/logo.png
// @description Сайт edu.kpfu.ru загружается слишком долго на курсах. Проблема в том, что открытие курса подгружает все видео заранее. Этот скрипт заменяет встроенные видео на ссылку на них на ютубе, увеличивая скорость загрузки курса.
// ==/UserScript==

function saveSetting(settingName, value) {
  localStorage.setItem(settingName, value.toString());
}

function getSetting(settingName, defaultValue) {
  if (localStorage.getItem(settingName))
    return localStorage.getItem(settingName);
  saveSetting(settingName, defaultValue);
  return defaultValue;
}

var enabled = getSetting("re-enabled", "true") === "true";
var openInNewTab = getSetting("re-open-in-new-tab", "true") === "true";
var showThumbnails = getSetting("re-show-thumbnails", "true") === "true";
var thumbnailsQuality = getSetting("re-thumbnails-quality", "high");

function initializeSettingsMenu() {
  function enabledCallback(event) {
    event.stopPropagation();
    enabled = enabledElement.getElementsByTagName("input")[0].checked;
    saveSetting("re-enabled", enabled);
    location.reload();
  }

  function openInNewTabCallback(event) {
    event.stopPropagation();
    openInNewTab = openInNewTabElement.getElementsByTagName("input")[0].checked;
    saveSetting("re-open-in-new-tab", openInNewTab);
    location.reload();
  }

  function showThumbnailsCallback(event) {
    event.stopPropagation();
    showThumbnails =
      showThumbnailsElement.getElementsByTagName("input")[0].checked;
    saveSetting("re-show-thumbnails", showThumbnails);
    location.reload();
  }

  function changeQuality(event, quality) {
    event.stopPropagation();
    thumbnailsQuality = quality;
    saveSetting("re-thumbnails-quality", thumbnailsQuality);
    location.reload();
  }
  var a = document.createElement("div");
  a.className = "dropdown";
  a.innerHTML = `<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
		Настройки RYE
	</button>
	<ul class="dropdown-menu menu dropdown-menu-right align-tr-br">
		<li class="dropdown-item dropdown-input" id="re-dropdown-enabled"><label><input type="checkbox"> Включить</label></li>
		<li class="dropdown-item dropdown-input" id="re-dropdown-open-in-new-tab"><label><input type="checkbox"> Открывать видео в новых вкладках</label></li>
		<li class="dropdown-item dropdown-input" id="re-dropdown-show-thumbnails"><label><input type="checkbox"> Показывать изображения</label></li>
		<li class="dropdown-item" id="re-dropdown-quality-label">Качество изображений:</li>
		<li class="dropdown-item dropdown-input" id="re-dropdown-quality-max"><label><input type="radio" name="re-quality"> Наилучшее</label></li>
		<li class="dropdown-item dropdown-input" id="re-dropdown-quality-high"><label><input type="radio" name="re-quality"> Высокое</label></li>
		<li class="dropdown-item dropdown-input" id="re-dropdown-quality-medium"><label><input type="radio" name="re-quality"> Среднее</label></li>
		<li class="dropdown-item dropdown-input" id="re-dropdown-quality-low"><label><input type="radio" name="re-quality"> Плохое</label></li>
		<li class="dropdown-item dropdown-input" id="re-dropdown-quality-default"><label><input type="radio" name="re-quality"> По-умолчанию</label></li>
	</ul>`;
  a.style.marginLeft = "0.5rem";
  document.getElementById("topBar").appendChild(a);
  var enabledElement = document.getElementById("re-dropdown-enabled");
  var openInNewTabElement = document.getElementById(
    "re-dropdown-open-in-new-tab"
  );
  var showThumbnailsElement = document.getElementById(
    "re-dropdown-show-thumbnails"
  );
  var thumbnailsQualityMaxElement = document.getElementById(
    "re-dropdown-quality-max"
  );
  var thumbnailsQualityHighElement = document.getElementById(
    "re-dropdown-quality-high"
  );
  var thumbnailsQualityMediumElement = document.getElementById(
    "re-dropdown-quality-medium"
  );
  var thumbnailsQualityLowElement = document.getElementById(
    "re-dropdown-quality-low"
  );
  var thumbnailsQualityDefaultElement = document.getElementById(
    "re-dropdown-quality-default"
  );
  enabledElement.getElementsByTagName("input")[0].checked = enabled;
  openInNewTabElement.getElementsByTagName("input")[0].checked = openInNewTab;
  showThumbnailsElement.getElementsByTagName("input")[0].checked =
    showThumbnails;
  switch (thumbnailsQuality) {
    case "max":
      thumbnailsQualityMaxElement.getElementsByTagName(
        "input"
      )[0].checked = true;
      break;
    case "high":
      thumbnailsQualityHighElement.getElementsByTagName(
        "input"
      )[0].checked = true;
      break;
    case "medium":
      thumbnailsQualityMediumElement.getElementsByTagName(
        "input"
      )[0].checked = true;
      break;
    case "low":
      thumbnailsQualityLowElement.getElementsByTagName(
        "input"
      )[0].checked = true;
      break;
    case "default":
      thumbnailsQualityDefaultElement.getElementsByTagName(
        "input"
      )[0].checked = true;
      break;
    default:
      break;
  }
  enabledElement.onclick = enabledCallback;
  openInNewTabElement.onclick = openInNewTabCallback;
  showThumbnailsElement.onclick = showThumbnailsCallback;
  thumbnailsQualityMaxElement.onclick = (event) => changeQuality(event, "max");
  thumbnailsQualityHighElement.onclick = (event) =>
    changeQuality(event, "high");
  thumbnailsQualityMediumElement.onclick = (event) =>
    changeQuality(event, "medium");
  thumbnailsQualityLowElement.onclick = (event) => changeQuality(event, "low");
  thumbnailsQualityDefaultElement.onclick = (event) =>
    changeQuality(event, "default");
}

function removeEmbeds() {
  if (!enabled) return;
  [].slice.call(document.getElementsByTagName("iframe")).forEach((element) => {
    if (element.src.includes("youtube.com/embed/")) {
      let video_id = element.src.split("/").pop().split("?")[0];
      let image_url = `https://img.youtube.com/vi/${video_id}/`;
      switch (thumbnailsQuality) {
        case "max":
          image_url += "maxres";
          break;
        case "high":
          image_url += "hq";
          break;
        case "medium":
          image_url += "mq";
          break;
        case "low":
          image_url += "sd";
          break;
        default:
          break;
      }
      image_url += "default.jpg";
      let url = element.src.replace("?", "&").replace("embed/", "watch?v=");
      let newContent = `<a ${
        openInNewTab ? 'target="_blank"' : ""
      } class="aalink" onclick href="${url}">${
        element.parentElement.innerText
      }<br>`;
      if (showThumbnails)
        newContent += `<img src="${image_url}" width=${element.width} height=${element.height}></img>`;
      else newContent += `${url}`;
      newContent += `</a>`;
      element.parentElement.innerHTML = newContent;
    }
  });
}

initializeSettingsMenu();
removeEmbeds();
