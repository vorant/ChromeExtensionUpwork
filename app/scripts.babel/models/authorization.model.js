'use strict';

const _storageField = 'isAuthorized';

class Authorization {
  constructor() {}

  static save(data) {
    localStorage[_storageField] = data;
  }

  static isAuthorized() {
    return localStorage[_storageField] === 'true';
  }
}

export default Authorization;