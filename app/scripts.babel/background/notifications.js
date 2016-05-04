'use strict';

function audioNotification(){
  var yourSound = new Audio('sound/sound.mp3');
  yourSound.play();
}

class MyNotification {
  constructor() {}

  static newProject(project) {
    let notification = new Notification('New project', {
      icon: 'images/icon-128.png',
      body: project.title
    });

    notification.onclick = function () {
      window.open(`https://www.upwork.com/jobs/_${project.ciphertext}`);
    };
    audioNotification();
  }

  static notAuthorized() {
    new Notification('Not Authorized', {
      icon: 'images/icon-128.png',
      body: 'Authorize at Upwork!'
    });
    audioNotification();
  }
}

export default MyNotification;