$(document).ready(function() {

  console.log('Init....');
  var app =  window['wheel']();

  $('.tab-link').click(function(t) {
    $('.main div').hide();
    let target = t.target.getAttribute('target-id');
    $('#' + t.target.getAttribute('target-id')).show();

    console.log('app: ' + typeof app)

    // if(typeof window.app == "object") {
    //   window.app.destroy();
    // }

    console.log(target)

    app = window[target];

    console.log('app: ' + typeof app)
  })
  
})