import * as PIXI from "pixi.js"

export class Menu {

    stage: PIXI.Container
    screen: PIXI.Rectangle
    gameHasStarted: boolean

    constructor(stage: PIXI.Container, background: PIXI.Texture, screen: PIXI.Rectangle) {

        this.stage = stage;
        this.screen = screen;
        this.gameHasStarted = false;

        const text = new PIXI.Text("the red \nand \nthe robin");
        text.style = this._getTextStyle(true);
        text.x = this.screen.width / 2;
        text.y = this.screen.height / 2 - 125;
        text.anchor.set(0.5);

        const button = new PIXI.Graphics();
        button.x = this.screen.width / 2 - 100;
        button.y = this.screen.height / 2;
        button.beginFill(0xd587ae);
        button.drawRoundedRect(0, 0, 200, 75, 16);

        const playText = new PIXI.Text("play");

        playText.style = this._getTextStyle(false);
        playText.x = 100;
        playText.anchor.set(0.5);
        playText.y = 30;

        button.addChild(playText);

        button.interactive = true
        button.on('pointerdown', () => this._onClick())
        button.on('pointerover', () => this._onHover())

        const bg = new PIXI.Sprite(background);

        bg.x = -300;
        bg.tint = 0xc7c0cf
        bg.scale.set(0.5)

        stage.addChild(bg);
        stage.addChild(text);
        stage.addChild(button);

    }

    private _getTextStyle(withGradient: boolean): PIXI.TextStyle {
        const textStyle = new PIXI.TextStyle({
            fillGradientType: 1,
            fillGradientStops: [
                0
            ],
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 50,
            fontVariant: "small-caps",
            fontWeight: "bold",
            align: "center"
        });

        let fillArray = ["white"];

        if (withGradient) {
            fillArray.push("#b5d4dd");
        }

        textStyle.fill = fillArray;

        return textStyle;
    }

    private _onClick(): void {
        this.gameHasStarted = true;
    }

    // todo: add button hover effect
    private _onHover(): void {

    }
}