import animations from 'js/animations.js'

$(document).ready(function() {

  // window.app = new animations('wheel');
  window.app = new animations('neon');
  window.app = new animations('wheel');
  window.app['resize']();

});