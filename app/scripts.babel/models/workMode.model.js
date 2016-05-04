'use strict';

const _storageField = 'WorkMode';

class WorkMode {
  constructor() {}

  static save(data) {
    localStorage[_storageField] = data;
  }

  static get() {
    return localStorage[_storageField] === 'true';
  }

}

export default WorkMode;