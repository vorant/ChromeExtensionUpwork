'use strict';
import Form from './options/form.js';
let form = new Form();

$(document).ready(function() {
  form.fillMultiSelects(['selectExclude']);
  form.fill();
  form.enableSlider({sliderId:'feedbackSlider', inputId:'feedbackStars'});
  form.enableSlider({sliderId:'optionsTimeSlider', inputId:'optionsTimeValue'});
  form.enableMultiSelects();
  addSubmitListener()
});

function addSubmitListener() {
  $( 'form' ).on('submit', function( event ) {
    event.preventDefault();
    let array = $(this).serializeArray();

    form.saveData(array);
    chrome.runtime.sendMessage({message: 'reset', who: 'options'});

    window.close();
  });
}

