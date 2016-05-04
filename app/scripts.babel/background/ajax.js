'use strict';

class Ajax {
  constructor() {};

  getJobs(url) {
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.setRequestHeader('accept', 'application/json, text/plain, */*');
    xhr.setRequestHeader('x-odesk-user-agent', 'oDesk LM');
    xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');

    xhr.send();

    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
          reject(xhr.status + ': ' + xhr.statusText);
        } else {
          resolve(xhr.responseText);
        }
      };
    });
  }
}

export default Ajax;
