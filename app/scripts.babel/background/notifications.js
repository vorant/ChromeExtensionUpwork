'use strict';
import Options from './../models/options.model';
import Badge from './badge';

function audioNewProject(){
  new Audio('sound/sound-new-project.mp3').play();
}

function audioAlarm(){
  new Audio('sound/sound-alarm.mp3').play();
}

class MyNotification {
  constructor() {}

  static newProject(project, projectModel) {

    let options = Options.get();
    
    if (options.notification === 'on') {
      let notification = new Notification('New project', {
        icon: 'images/icon-128.png',
        body: project.title
      });

      notification.onclick = function () {
        let id = project[projectModel.idField];
        projectModel.setProjectAsOld(id);

        let counter = projectModel.getNewCount();
        Badge.set(counter);
        
        notification.close();
        window.open(`https://www.upwork.com/jobs/_${project.ciphertext}`);
      };
    }
    if (options.notification === 'on' && options.notificationSound === 'on') {
      audioNewProject();
    }
  }

  static notAuthorized() {
    let options = Options.get();
    if (options.notification === 'on') {
      new Notification('Not Authorized', {
        icon: 'images/icon-128.png',
        body: 'Authorize at Upwork!'
      });
    }
    if (options.notification === 'on' && options.notificationSound === 'on') {
      audioAlarm();
    }
  }
}

export default MyNotification;