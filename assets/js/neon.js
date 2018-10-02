export default class neon {

  constructor() {
    this.initW = $('#neon-container').width();
    this.initH = $('#neon-container').height();

    this.app = new PIXI.Application(this.initW, this.initH, {
      autoResize: true,
      resolution: devicePixelRatio,
      transparent: true
    });

    $('#neon').append(this.app.view);

    this.parent = this.app.view.parentNode;

    this.bg = PIXI.Sprite.fromImage('assets/images/showdown/showdown-off.png');

    this.bg.anchor.set(0.5);

    this.bg.ratio = this.initH * 2.4 / this.initH;

    this.bg.x = this.app.screen.width / 2;
    this.bg.y = this.app.screen.height / 2;

    this._l = () => this.resize();
    window.addEventListener('load', this._l);
    window.addEventListener('resize', this._l);

    this.app.stage.addChild(this.bg);
    this.firstResize = false;
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
    if (!this.firstResize) {
      this.backgroundSize = {
        'width': this.bg.width,
        'height': this.bg.height
      }
    }
    const parent = this;
    setTimeout(function() {
      const calcInnerHeight = window.innerHeight * 2.4 / 5;
      const calcInnerWidth = window.innerWidth * 0.9;
      const width = Math.max(Math.min(calcInnerWidth, calcInnerHeight), 240);
      const height = Math.max(Math.min(calcInnerHeight > calcInnerWidth ? calcInnerWidth / 2.4 : calcInnerHeight / 2.4, window.innerHeight * 2.4 / 5.5), 100);
      const ratio = height / width;
      const containerSize = {
        'width': $('#neon-container').width(),
        'height': $('#neon-container').height()
      };
      const scale = Math.min(containerSize.width / parent.backgroundSize.width, containerSize.height / parent.backgroundSize.height) * 0.8;
      parent.bg.scale.x = parent.bg.scale.y = scale;
      parent.app.renderer.resize(width, height);
      console.log(width, height);
      parent.bg.position.set(parent.app.screen.width / 2, parent.app.screen.height / 2);
    }, 10);
    this.firstResize = true;
  }

}