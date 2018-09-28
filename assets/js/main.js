// JS classes
// import wheel from 'js/wheel.js'
// import neon from 'js/neon.js'
import animations from 'js/animations.js'

function m() {
  console.log('mela....')
}

$(document).ready(function() {

  // var animations = {
  //   wheel,
  //   neon
  // }
  
  // $(window).on('resize', m());
  // window.addEventListener('load', m());
  // window.addEventListener('resize', m());

  console.log('Init....');
  // window.app =  new wheel();
  window.app =  new animations('wheel');

  $('.tab-link').click(function(t) {
    $('.main div').hide();

    window.app.destroy();

    // window.app.app.stage.destroy(true);
    // window.app.app.stage = null;

    // // window.app.app.refs.gameCanvas.removeChild(window.app.app.renderer.view);
    
    // window.app.app.renderer.destroy( true );
    // window.app.app.renderer = null; 

    delete window.app;

    // window.removeEventListener('load', () => this.resize());
    // window.removeEventListener('resize', () => this.resize());

    // unset(winodow.app);

    let target = t.target.getAttribute('target-id');
    $('#' + target).show();
    console.log('new tab: ' +target);

    window.app =  new animations(target);
    window.app['resize']();

  })
  
})