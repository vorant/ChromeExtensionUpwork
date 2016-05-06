'use strict';
import Options from './../models/options.model';

function audioNotification(){
  new Audio('sound/sound.mp3').play();
}

class MyNotification {
  constructor() {}

  static newProject(project) {

    let options = Options.get();
    
    if (options.notification === 'on') {
      let notification = new Notification('New project', {
        icon: 'images/icon-128.png',
        body: project.title
      });

      notification.onclick = function () {
        window.open(`https://www.upwork.com/jobs/_${project.ciphertext}`);
      };
    }
    if (options.notification === 'on' && options.notificationSound === 'on') {
      audioNotification();
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
      audioNotification();
    }
  }
}

export default MyNotification;