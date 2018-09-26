export default class wheel {

  constructor() {

    var initW = $('#wheel').width();
    var initH = $('#wheel').height();
    console.log('sw: ' + initW + ' sh: ' + initH);

    var app = new PIXI.Application({
      backgroundColor: 0x1099bb,
      autoResize: true,
      resolution: devicePixelRatio
    });
    // app.renderer = new PIXI.autoDetectRenderer($('#wheel').height(), $('#wheel').width())

    // console.log('Plugging in: wheel');
    // window.app = app;

    app.renderer.autoResize = true;
    window.addEventListener('resize', resize);

    $('#wheel').append(app.view);

    // WoF
    var wheel = PIXI.Sprite.fromImage('assets/images/wheel/wheel.png');
    var button = PIXI.Sprite.fromImage('assets/images/wheel/btn-spin.png');
    var marker = PIXI.Sprite.fromImage('assets/images/wheel/marker.png');
    wheel.anchor.set(0.5);
    wheel.ratio = wheel.width / wheel.height;
    // console.log(' wr: ' + wheel.ratio);

    button.anchor.set(0.5);
    button.x = app.screen.width / 2;
    button.y = wheel.position.y + wheel.height / 1.65;
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', onButtonClick);

    marker.anchor.set(0.5);
    marker.x = app.screen.width / 2;
    marker.y = wheel.position.y - wheel.height / 1.65;

    if (initW != 0 && initW < initH) {
      wheel.width = 0.4 * (initW / wheel.ratio);
      wheel.height = 0.4 * (initW * wheel.ratio);
      // console.log('sw: ' + initW + ' sh: ' + initH);
      // console.log('w: ' + wheel.width + ' h: ' + wheel.height);
    } else {
      wheel.width = 0.4 * initH * wheel.ratio;
      wheel.height = 0.4 * initH / wheel.ratio;
      // console.log('sw: ' + initW + ' sh: ' + initH);
      // console.log('w: ' + wheel.width + ' h: ' + wheel.height);
    }

    // move the sprite to the center of the screen
    wheel.x = app.screen.width / 2;
    wheel.y = app.screen.height / 2;

    window.addEventListener("load", resize);

    app.stage.addChild(wheel);
    app.stage.addChild(button);
    app.stage.addChild(marker);

  }

  // console.log('initW! : ' + initW)

  resize() {

    const parent = app.view.parentNode;
    const calculatedWidth = (window.innerWidth >= 1024) ? (window.innerHeight * 0.5) : (window.innerHeight * 0.8);
    const wheelSize = Math.min(parent.clientWidth, calculatedWidth);
    const ratio = wheelSize / 750;

    wheel.scale.x = wheel.scale.y = ratio;
    app.renderer.resize(wheelSize, wheelSize + 200);
    wheel.position.set(app.screen.width / 2, app.screen.height / 2);

    button.position.set(app.screen.width / 2, wheel.position.y + wheel.height / 1.65);
    button.scale.x = button.scale.y = ratio * 1.5;

    marker.position.set(app.screen.width / 2, (wheel.position.y - wheel.height / 1.65));
    marker.scale.x = marker.scale.y = ratio * 1.5;

    // console.log('resized! : ' + ratio);
    // console.log('w: ' + wheel.width + ' h: ' + wheel.height);
  }

  getDegrees(number, fields, lapsNumber) {
    return {
      minValue: (number - 1) * Math.PI / fields * 2 + lapsNumber,
      maxValue: number * Math.PI / fields * 2 + lapsNumber
    };
  }

  getRange(number, fields) {
    const lapsNumber = Math.floor(Math.random() * (20 - 5 + 1) + 5) * Math.PI * 2;
    const range = getDegrees(number, fields, lapsNumber);
    return range;
  }

  getStopPoint() {
    const range = getRange(0, 4);  // from API
    const stopPoint = Math.random() * (range.maxValue - range.minValue) + range.minValue;
    console.log('stopP: ' + stopPoint)
    return stopPoint;
  }

  easeInOutSpin(endPoint, actualPoint) {
    const ratio = (actualPoint + 1) / endPoint;
    const result = ratio > 0.3 ? Math.pow(Math.min(1, Math.max(0, ratio)) - 1, 2) : 1 - Math.pow(Math.min(1, Math.max(0, ratio)) - 1, 2);
    return result + (ratio > 0.95 ? (ratio > 0.97 ? (ratio > 0.99 ? 0.02 : 0.03) : 0.04) : 0.05);
  }

  onButtonClick() {
    const point = getStopPoint();
    wheel.rotation = 0;
    const rotate = () => {
      if (wheel.rotation >= point) {
        wheel.rotation = point;
        app.ticker.remove(rotate);
      } else {
        wheel.rotation += easeInOutSpin(point, wheel.rotation);
      }
    };
    app.ticker.add(rotate);
  }
}