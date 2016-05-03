'use strict';
import Projects from './models/projects.model';
import WorkMode from './models/workMode.model';
import Authorization from './models/authorization.model';

let projectModel = new Projects();
let workMode = WorkMode.get();

function getItemHTML(project) {
    return `<li class="job-list__job">
        <a href="#" class="job-list__job-link">
          ${project.title}
        </a>
      </li>`;
}

function fillList() {
  let html = '';
  projectModel.projects.forEach(project => {
    html += getItemHTML(project);
  });
  $('.job-list').html(html); 
}

function addListeners() {
 
  $('._switch-on').off().on('click', () => {
    !workMode ? handler('switch-on') : '';
  });

  $('._switch-off').off().on('click', (evt) => {
    workMode ? handler('switch-off') : '';
  });

  function handler(message) {
    workMode = !workMode;
    WorkMode.save(workMode);
    chrome.runtime.sendMessage({message: message});
  }
}

function checkAuthorization() {
  let isAuthorized = Authorization.isAuthorized();
  let authorizationDOM = $('.authorization');
  if (isAuthorized) {
    authorizationDOM.addClass('_authorized').text('Authorized');
  } else {
    authorizationDOM.addClass('_not-authorized').text('Not authorized');
  }
}

function checkMode() {
  let inputClass = workMode ? '_switch-on' : '_switch-off'; 
  $(`.${inputClass}`).find('input').attr('checked','checked');
}

$(document).ready(function () {
  fillList();
  addListeners();
  checkMode();
  checkAuthorization();
});