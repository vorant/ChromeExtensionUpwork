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

  enableMultiSelects() {
    $('select').material_select();
  }

  enableSlider(params) {
    let range = {},
        step = '';

    if (params.sliderId == 'optionsTimeSlider') {
      range = {
        min: 1,
        max: 60
      };
      step = 1;
    } else {
      range = {
        min: 0,
        max: 5
      };
      step = 0.5;
    }
    let el = $(`#${params.inputId}`);
    
    let slider2 = document.getElementById(params.sliderId);
    let value = el.val() || 0;
    
    noUiSlider.create(slider2, {
      start: value,
      step: step,
      animate: false,
      range: range
    });

    slider2.noUiSlider.on('update', function( values, handle ){
      el.val(values[handle]);
    });
  }

  saveData(data) {
    Options.save(data);
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
      }
    }
  }
}

export default Form;