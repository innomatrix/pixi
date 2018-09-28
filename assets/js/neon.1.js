export default class neon {

    constructor() {

        var initW = $('#' + target).width();
        var initH = $('#' + target).height();
        console.log('sw: ' + initW + ' sh: ' + initH);

        var app = new PIXI.Application({
            autoResize: true,
            resolution: devicePixelRatio
        });

        app.renderer.autoResize = true;
        window.addEventListener('resize', resize);

        $('#' + target).append(app.view);

        // WoF
        var bg = PIXI.Sprite.fromImage('assets/images/showdown/showdown-off.png');
        // var button = PIXI.Sprite.fromImage('assets/images/wheel/btn-spin.png');
        // var marker = PIXI.Sprite.fromImage('assets/images/wheel/marker.png');
        bg.anchor.set(0.5);
        bg.ratio = bg.width / bg.height;
        // console.log(' wr: ' + bg.ratio);

        // button.anchor.set(0.5);
        // button.x = app.screen.width / 2;
        // button.y = bg.position.y + bg.height / 1.65;
        // button.interactive = true;
        // button.buttonMode = true;
        // button.on('pointerdown', onButtonClick);

        // marker.anchor.set(0.5);
        // marker.x = app.screen.width / 2;
        // marker.y = bg.position.y - bg.height / 1.65;

        if (initW != 0 && initW < initH) {
            bg.width = 0.4 * (initW / bg.ratio);
            bg.height = 0.4 * (initW * bg.ratio);
            // console.log('sw: ' + initW + ' sh: ' + initH);
            // console.log('w: ' + bg.width + ' h: ' + bg.height);
        } else {
            bg.width = 0.4 * initH * bg.ratio;
            bg.height = 0.4 * initH / bg.ratio;
            // console.log('sw: ' + initW + ' sh: ' + initH);
            // console.log('w: ' + bg.width + ' h: ' + bg.height);
        }

        // move the sprite to the center of the screen
        bg.x = app.screen.width / 2;
        bg.y = app.screen.height / 2;


        window.addEventListener("load", resize);

        app.stage.addChild(bg);
    }

    resize() {

        const parent = app.view.parentNode;
        const calculatedWidth = (window.innerWidth >= 1024) ? (window.innerHeight * 0.5) : (window.innerHeight * 0.8);
        const wheelSize = Math.min(parent.clientWidth, calculatedWidth);
        const ratio = wheelSize / 750;

        bg.scale.x = bg.scale.y = ratio;
        app.renderer.resize(wheelSize, wheelSize + 200);
        bg.position.set(app.screen.width / 2, app.screen.height / 2);

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
        bg.rotation = 0;
        const rotate = () => {
            if (bg.rotation >= point) {
                bg.rotation = point;
                app.ticker.remove(rotate);
            } else {
                bg.rotation += easeInOutSpin(point, bg.rotation);
            }
        };
        app.ticker.add(rotate);
    }

}
