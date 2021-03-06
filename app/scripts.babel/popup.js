'use strict';
import Projects      from './models/projects.model';
import WorkMode      from './models/workMode.model';
import Authorization from './models/authorization.model';
import Badge         from './background/badge';

let projectModel = new Projects();
let workMode = WorkMode.get();

function getItemHTML(project) {
  let modifier = project.isNew ? 'active' : '';
  return `<a href="https://www.upwork.com/jobs/_${project.ciphertext}"
              data-projectId="${project[projectModel.idField]}"
              target="_blank"
              class="collection-item ${modifier}">
              ${project.title}
          </a>`;
}

function fillList() {
  let html = '';
  projectModel.projects.forEach(project => {
    html += getItemHTML(project);
  });
  $('.collection').html(html);
}

function addWorkModeListeners() {
 
  $('.work-mode__label').on('click', debounce(handler, 10));

  function handler() {
    workMode = !workMode;
    WorkMode.save(workMode);
    let message = workMode ? 'switch-on' : 'switch-off';
    chrome.runtime.sendMessage({message: message, who: 'popup'});
  }
}

function addButtonListener() {
  $('#buttonOptions').on('click', function () {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  });
}

function addJobListener() {
  $('.collection-item').off().on('click', function(evt) {
    
    let projectId = $(this).attr('data-projectId');

    projectModel.setProjectAsOld(projectId);

    let counter = projectModel.getNewCount();
    Badge.set(counter);

    if (evt.which == 2) { // 2 - is middle button mouse
      $(this).removeClass('active');
      evt.preventDefault();
      return false;
    }
  });
}

function checkAuthorization() {
  Authorization.isAuthorized().then(isAuthorized => {
    let popupBody = $('.popup__body');
    
    if (isAuthorized) {
      popupBody.addClass('_authorization_true');
      popupBody.removeClass('_authorization_false');
    } else {
      popupBody.removeClass('_authorization_true');
      popupBody.addClass('_authorization_false');
    }
  });
}

function checkMode() {
  if (workMode) {
    $(`.work-mode__input`).attr('checked','checked');
  }
}

function backgroundListeners() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message = 'newProject' && request.job) {
      let project = request.job;
      projectModel.projects.unshift(project);
      let html = getItemHTML(project);
      $('.collection').prepend(html);
      addJobListener();
    }
  });
}

$(document).ready(function () {
  fillList();
  addWorkModeListeners();
  addJobListener();
  addButtonListener();
  checkMode();
  checkAuthorization();
  backgroundListeners();

  // chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});

function debounce(fn, time = 1){
  let busy = false;
  return function(){
    if (!busy) {
      busy = true;
      setTimeout(function () {
        fn();
        busy = false;
      }, time);
    }
  }
}