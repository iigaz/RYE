// ==UserScript==
// @name        Replace youtube embeds with links - edu.kpfu.ru
// @match       https://edu.kpfu.ru/course/view.php
// @grant       none
// @version     1.1
// @author      iigaz
// @icon        https://edu.kpfu.ru/pluginfile.php/1/theme_academi/logo/1679319567/logo1.png
// @description Сайт edu.kpfu.ru загружается слишком долго на курсах. Проблема в том, что открытие курса подгружает все видео заранее. Этот скрипт заменяет встроенные видео на ссылку на них на ютубе, увеличивая скорость загрузки курса.
// ==/UserScript==

[].slice.call(document.getElementsByTagName("iframe")).forEach(element => {
  if (element.src.includes("youtube.com/embed/")) {
    var video_id = element.src.split('/').pop().split("?")[0];
    element.parentElement.innerHTML =
      `<a target="_blank" class="aalink" onclick href="${element.src.replace("embed/", "watch?v=")}">${element.parentElement.innerText}<br>
  <img src="https://img.youtube.com/vi/${video_id}/hqdefault.jpg" width=${element.width} height=${element.height}></img></a>`;
  }
});
