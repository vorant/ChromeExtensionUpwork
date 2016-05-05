'use strict';
import Form from './options/form.js';
let form = new Form();




$(document).ready(function() {
  // var data = form.getData();
  // $.parseJSON( )
  // console.log(data)
  // debugger
  
  form.fillMultiSelects(['selectInclude', 'selectExclude']);
  form.fill();
  form.enableSlider({sliderId:'feedbackSlider', inputId:'feedbackStars'});
  form.enableMultiSelects();
});

// $('#buttonSave').on('click', e => {
//   debugger
// })

$( 'form' ).on('submit', function( event ) {
  event.preventDefault();
  let str = $(this).serialize();
  
  form.saveData(str);
  window.close();
});

function saveForm() {
  
  //  fixedPrice hourly     budgetMin budgetMax phrasesContain phrasesExclude clientNew paymentVerified selectInclude selectExclude  feedbackStars  
}

