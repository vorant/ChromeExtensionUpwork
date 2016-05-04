'use strict';

const _storageField = 'form';

class Options {
  constructor() {}

  static save(str) {
    localStorage[_storageField] = str;
  }

  static get() {
    let str = localStorage[_storageField] || '';
    let data = {};
    str
      .split('&')
      .forEach(el => {
        let arr = el.split('=');

        let name = arr[0];
        let val = arr[1];

        if (data[name]) {
          if (Array.isArray(data[name])) {
            data[name].push(val);
          } else {
            data[name] = [data[name], val]
          }

        } else {
          data[name] = val;
        }
      });
    return data;
  }

}

export default Options;