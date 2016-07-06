'use strict';
import Ajax from './../background/ajax';
import {url} from './../background/url.constant';
import MyNotification from './../background/notifications';

const _storageField = 'isAuthorized';

class Authorization {
  constructor() {}

  static save(data) {
    localStorage[_storageField] = data;
  }

  static check(result) {
    let isAuthorized = false;

    if (!(result.indexOf('<!DOCTYPE html>') + 1)) {
      isAuthorized = true;
    } else {
      MyNotification.notAuthorized();
    }

    Authorization.save(isAuthorized);
    return isAuthorized;
  }

  static isAuthorized() {
    let self = this;

    return new Ajax()
        .getJobs(url)
        .then(result => self.check(result));
  }
}

export default Authorization;