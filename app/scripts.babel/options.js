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
  form.enableSlider({sliderId:'feedbackStars', textClass:'stars-amount'});
  form.enableMultiSelects(['selectInclude', 'selectExclude']);
});

// $('#buttonSave').on('click', e => {
//   debugger
// })

$( 'form' ).on('submit', function( event ) {

  event.preventDefault();
  let str = $(this).serialize();
  form.saveData(str)
});

function saveForm() {
  
  //  fixedPrice hourly     budgetMin budgetMax phrasesContain phrasesExclude clientNew paymentVerified selectInclude selectExclude  feedbackStars  
}
