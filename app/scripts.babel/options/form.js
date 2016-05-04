'use strict';
import { countries } from './countries.js';
import Options from './../models/options.model';

function getOptionsHtml(countries){
  let html = '';

  countries.forEach(country => {
    html += `<option value="${country.name}">${country.name}</option>`;
  });
  
  return html; 
}

const _storageField = Symbol('form');

class Form {

  constructor() {
    this[_storageField] = 'form';
  };

  fillMultiSelects(ids) {
    let options = getOptionsHtml(countries);
    ids.forEach(id => $(`#${id}`).html(options));
  }

  enableMultiSelects(ids) {
    var params = {
      enableFiltering: true,
      filterBehavior: 'value'
    };
    ids.forEach(id => $(`#${id}`).multiselect(params));
  }

  enableSlider(params) {
    function setText(slideEvt) {
      $(`.${params.textClass}`).text(slideEvt.value);
    }
    let el = $(`#${params.sliderId}`);
    
    el.slider().on('slide', setText);
    setText({value: el.val()});
  }

  saveData(str) {
    Options.save(str);
  }

  fill() {
    let data = Options.get();
    for ( let name in data) {
      let value = data[name];
      
      var $el = $(`[name="${name}"]`),
        type = $el.attr('type');

      switch(type){
        case 'checkbox':
          $el.attr('checked', 'checked');
          break;
        case 'radio':
          $el.filter(`[value="${value}"]`).attr('checked', 'checked');
          break;
        case 'select':
          $el.find('option').each(function() {
            if (value.indexOf(this.value) + 1) {
              this.selected = true;
            }
          });
          break;
        default:
          $el.val(value);
          if (name == 'feedbackStars') {
            $el.attr('data-slider-value', value);
          } 
      }
    }
  }
}

export default Form;