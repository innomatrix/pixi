export default class wheel {

  constructor(resize) {

    this.initW = $('#wheel').width();
    this.initH = $('#wheel').height();

    var long = this.initW > this.initH ? this.initW : this.initH;
    console.log('sw: ' + this.initW + ' sh: ' + this.initH + ' long: ' + long);

    this.app = new PIXI.Application({
      backgroundColor: 0x1099bb,
      autoResize: true,
      resolution: devicePixelRatio
    });
    // this.app.renderer = new PIXI.autoDetectRenderer($('#this.wheel').height(), $('#this.wheel').width())

    // this.app.renderer.autoResize = true;

    $('#wheel').append(this.app.view);

    this.parent = this.app.view.parentNode;
    console.log('view append to #wheel!');

    // WoF
    this.wheel = PIXI.Sprite.fromImage('assets/images/wheel/wheel.png');
    this.wheel.anchor.set(0.5);
    this.wheel.ratio = this.wheel.width / this.wheel.height;

    this.wheel.x = this.app.screen.width / 2;
    this.wheel.y = this.app.screen.height / 2;

    if (this.initW != 0 && this.initW < this.initH) {
      this.wheel.width = 0.7 * (this.initW / this.wheel.ratio);
      this.wheel.height = 0.7 * (this.initW * this.wheel.ratio);
      // console.log('sw: ' + this.initW + ' sh: ' + this.initH);
      // console.log('w: ' + this.wheel.width + ' h: ' + this.wheel.height);
    } else {
      this.wheel.width = 0.7 * this.initH * this.wheel.ratio;
      this.wheel.height = 0.7 * this.initH / this.wheel.ratio;
      // console.log('sw: ' + this.initW + ' sh: ' + this.initH);
      // console.log('w: ' + this.wheel.width + ' h: ' + this.wheel.height);
    }    

    // console.log(' wr: ' + this.wheel.this.ratio);
    this.app.stage.addChild(this.wheel);
    console.log('stage wheel injection at Y: '+ this.wheel.y);

    this.button = PIXI.Sprite.fromImage('assets/images/wheel/btn-spin.png');
    this.button.anchor.set(0.5);
    this.button.x = this.app.screen.width / 2;
    this.button.y = this.wheel.position.y + this.wheel.height / 1.65;

    console.log('wheel Y: '+ this.wheel.position.y)
    console.log('wheel height: '+ this.wheel.height)

    console.log('btn Y: '+ this.button.y)
    this.button.interactive = true;
    this.button.buttonMode = true;
    this.button.on('pointerdown', () => this.onButtonClick());

    this.marker = PIXI.Sprite.fromImage('assets/images/wheel/marker.png');
    this.marker.anchor.set(0.5);
    this.marker.x = this.app.screen.width / 2;
    this.marker.y = this.wheel.position.y - this.wheel.height / 1.65;
    console.log('mrk Y: '+ this.marker.y)    



    // move the sprite to the center of the screen
    this.wheel.x = this.app.screen.width / 2;
    this.wheel.y = this.app.screen.height / 2;

    // $(window).on('resize', this.resize());

    this._l = () => this.resize();
    

    window.addEventListener('load', this._l);
    window.addEventListener('resize', this._l);

    // window.addEventListener('load', () => this.resize(), true);
    // window.addEventListener('resize', () => this.resize(), true);

    if(resize) {
      this.resize();
      console.log('forceResize');
    }

    console.log('window resize && load eventListeners');

    this.app.stage.addChild(this.button);
    console.log('stage btn injection at Y: '+ this.button.y);

    this.app.stage.addChild(this.marker);

  }

  destroy() {
    window.removeEventListener('load', this._l);
    window.removeEventListener('resize', this._l);

    this.app.destroy({children:true, texture:true, baseTexture:true})

    console.warn('Listeneres removed!');
  }

  // console.log('initW! : ' + this.initW)

  resize() {
    var calculatedWidth = (window.innerWidth >= 1024) ? (window.innerHeight * 0.5) : (window.innerHeight * 0.8);

    var wheelSize = Math.min(this.parent.clientWidth, calculatedWidth);

    // var wheelSize = this.parent.clientWidth;

    console.log('wheelSize: ' + wheelSize);
    console.log('clientWidth: ' + this.parent.clientWidth);

    var ratio = wheelSize / 750;

    this.wheel.scale.x = this.wheel.scale.y = ratio;

    this.app.renderer.resize(wheelSize, wheelSize + 200);
    this.wheel.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

    this.button.position.set(this.app.screen.width / 2, this.wheel.position.y + this.wheel.height / 1.65);
    this.button.scale.x = this.button.scale.y = ratio * 1.5;

    this.marker.position.set(this.app.screen.width / 2, (this.wheel.position.y - this.wheel.height / 1.65));
    this.marker.scale.x = this.marker.scale.y = ratio * 1.5;

    console.log('resized! : ' + ratio);
    console.log('w: ' + this.wheel.width + ' h: ' + this.wheel.height);
  }

  getDegrees(number, fields, lapsNumber) {
    return {
      minValue: (number - 1) * Math.PI / fields * 2 + lapsNumber,
      maxValue: number * Math.PI / fields * 2 + lapsNumber
    };
  }

  getRange(number, fields) {
    var lapsNumber = Math.floor(Math.random() * (20 - 5 + 1) + 5) * Math.PI * 2;
    console.log('laps: ' + lapsNumber);
    console.log('number: ' + number);
    var range = this.getDegrees(number, fields, lapsNumber);
    return range;
  }

  getStopPoint() {
    var position = Math.floor(Math.random() * 5); // TODO API call
    var range = this.getRange(position, 4);  // from API
    console.log(range);
    var stopPoint = Math.random() * (range.maxValue - range.minValue) + range.minValue;
    console.log('stopP: ' + stopPoint)
    return stopPoint;
  }

  easeInOutSpin(endPoint, actualPoint) {
    var ratio = (actualPoint + 1) / endPoint;
    var result = ratio > 0.3 ? Math.pow(Math.min(1, Math.max(0, ratio)) - 1, 2) : 1 - Math.pow(Math.min(1, Math.max(0, ratio)) - 1, 2);
    return result + (ratio > 0.95 ? (ratio > 0.97 ? (ratio > 0.99 ? 0.02 : 0.03) : 0.04) : 0.05);
  }

  onButtonClick() {

    console.log('button got clicked');

    var point = this.getStopPoint();
    this.wheel.rotation = 0;
    var rotate = () => {
      if (this.wheel.rotation >= point) {
        this.wheel.rotation = point;
        this.app.ticker.remove(rotate);
      } else {
        this.wheel.rotation += this.easeInOutSpin(point, this.wheel.rotation);
      }
    };
    this.app.ticker.add(rotate);
  }
}