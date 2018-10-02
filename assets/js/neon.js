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
    const calcInnerHeight = window.innerHeight * 2.4 / 5;
    const calcInnerWidth = window.innerWidth * 0.9;
    const width = Math.max(Math.min(calcInnerWidth, calcInnerHeight), 240);
    const height = Math.max(Math.min(calcInnerHeight > calcInnerWidth ? calcInnerWidth / 2.4 : calcInnerHeight / 2.4, window.innerHeight * 2.4 / 5.5), 100);
    const ratio = height / width;
    this.bg.scale.x = this.bg.scale.y = 0.2;
    this.app.renderer.resize(width, height);
    this.bg.position.set(this.app.screen.width / 2, this.app.screen.height / 2);

  }

}