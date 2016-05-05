'use strict';
import Projects from './models/projects.model';
import WorkMode from './models/workMode.model';
import Authorization from './models/authorization.model';

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
    chrome.runtime.sendMessage({message: message});
  }
}

function addJobListener() {
  $('.collection-item').on('click', function(evt) {
    let projectId = $(this).attr('data-projectId');
    projectModel.projects = projectModel.projects.map(project => {
      if (project[projectModel.idField] == projectId) {
        project.isNew = false;   
      }
      return project;
    });
    projectModel.save();
  });
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
  
  if (workMode) {
    $(`.work-mode__input`).attr('checked','checked');
  }
}

$(document).ready(function () {
  fillList();
  addWorkModeListeners();
  addJobListener();
  checkMode();
  checkAuthorization();
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