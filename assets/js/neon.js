export default class neon {

  constructor() {

    this.initW = $('#neon').width();
    this.initH = $('#neon').height();
    console.log('sw: ' + this.initW + ' sh: ' + this.initH);

    this.app = new PIXI.Application(this.initW, this.initH, {
      autoResize: true,
      resolution: devicePixelRatio,
      transparent: true
    });

    // this.app.renderer.autoResize = true;
    // window.addEventListener('resize', () => this.resize());

    $('#neon').append(this.app.view);
    // $('#' + target).append(app.view);
    this.parent = this.app.view.parentNode;

    // BG
    this.bg = PIXI.Sprite.fromImage('assets/images/showdown/showdown-off.png');
    // var button = PIXI.Sprite.fromImage('assets/images/wheel/btn-spin.png');
    // var marker = PIXI.Sprite.fromImage('assets/images/wheel/marker.png');
    this.bg.anchor.set(0.5);
    this.bg.ratio = this.bg.width / this.bg.height;
    console.log('bg.ratio: ' + this.bg.ratio);

    // button.anchor.set(0.5);
    // button.x = this.app.screen.width / 2;
    // button.y = this.bg.position.y + bg.height / 1.65;
    // button.interactive = true;
    // button.buttonMode = true;
    // button.on('pointerdown', onButtonClick);

    // marker.anchor.set(0.5);
    // marker.x = this.app.screen.width / 2;
    // marker.y = bg.position.y - bg.height / 1.65;

    // if (this.initW != 0 && this.initW < this.initH) {
    //     this.bg.width = 0.4 * (this.initW / this.bg.ratio);
    //     this.bg.height = 0.4 * (this.initW * this.bg.ratio);
    //     // console.log('sw: ' + initW + ' sh: ' + initH);
    //     // console.log('w: ' + bg.width + ' h: ' + bg.height);
    // } else {
    //     this.bg.width = 0.4 * this.initH * this.bg.ratio;
    //     this.bg.height = 0.4 * this.initH / this.bg.ratio;
    //     // console.log('sw: ' + initW + ' sh: ' + initH);
    //     // console.log('w: ' + this.bg.width + ' h: ' + this.bg.height);
    // }

    // move the sprite to the center of the screen
    this.bg.x = this.app.screen.width / 2;
    this.bg.y = this.app.screen.height / 2;

    this._l = () => this.resize();
    window.addEventListener('load', this._l);
    window.addEventListener('resize', this._l);

    this.app.stage.addChild(this.bg);
  }

  destroy() {
    window.removeEventListener('load', this._l);
    window.removeEventListener('resize', this._l);

    this.app.destroy({
      children: true,
      texture: true,
      baseTexture: true
    })

    console.warn('Listeneres removed!');
  }

  resize() {

    const calculatedWidth = (window.innerWidth >= 1024) ? (window.innerHeight * 0.5) : (window.innerHeight * 0.8);
    const wheelSize = Math.min(this.parent.clientWidth, calculatedWidth);
    const ratio = wheelSize / 750;

    this.bg.scale.x = this.bg.scale.y = ratio;
    this.app.renderer.resize(wheelSize, wheelSize + 200);
    this.bg.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

    //   button.position.set(app.screen.width / 2, bg.position.y + bg.height / 1.65);
    //   button.scale.x = button.scale.y = ratio * 1.5;

    //   marker.position.set(app.screen.width / 2, (bg.position.y - bg.height / 1.65));
    //   marker.scale.x = marker.scale.y = ratio * 1.5;

    // console.log('resized! : ' + ratio);
    // console.log('w: ' + bg.width + ' h: ' + bg.height);
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
    const range = getRange(0, 4); // from API
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
    bg.rotation = 0;
    const rotate = () => {
      if (bg.rotation >= point) {
        bg.rotation = point;
        this.app.ticker.remove(rotate);
      } else {
        bg.rotation += easeInOutSpin(point, bg.rotation);
      }
    };
    this.app.ticker.add(rotate);
  }

}