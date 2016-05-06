'use strict';

const _storageField = 'form';

class Options {
  constructor() {}

  static save(data) {
    localStorage[_storageField] = JSON.stringify(data);
  }

  static get() {
    let str = localStorage[_storageField] || '[]';
    let options = {};
    let data = [];

    try {
      data = JSON.parse(str);
    } catch (e) {
      throw new Error(`JSON parse error ${e}`);
    }
    data.forEach(option => {
        if (options[option.name]) {
          if (Array.isArray(options[option.name])) {
            options[option.name].push(option.value);
          } else {
            options[option.name] = [options[option.name], option.value]
          }
    
        } else {
          options[option.name] = option.value;
        }
    });
    return options;
  }

}

export default Options;