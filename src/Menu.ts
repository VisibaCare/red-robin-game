import * as PIXI from "pixi.js"

export class Menu {

    stage: PIXI.Container
    screen: PIXI.Rectangle
    gameHasStarted: boolean
    playButton: PIXI.Graphics

    constructor(stage: PIXI.Container, background: PIXI.Texture, screen: PIXI.Rectangle) {

        this.stage = stage;
        this.screen = screen;
        this.gameHasStarted = false;

        const textPart1 = new PIXI.Text("the red \nthe robin");
        textPart1.style = this._getMainTextStyle(true);
        textPart1.x = this.screen.width / 2;
        textPart1.y = this.screen.height / 2 - 125;
        textPart1.anchor.set(0.5);

        const textPart2 = new PIXI.Text("and");
        textPart2.style = new PIXI.TextStyle({ fontFamily: 'test', fontSize: 40, fill: 0xd27da8 })
        textPart2.x = this.screen.width / 2 - 20;
        textPart2.y = this.screen.height / 2 - 125;
        textPart2.anchor.set(0.5);

        const button = new PIXI.Graphics();
        button.x = this.screen.width / 2 - 100;
        button.y = this.screen.height / 2;
        button.beginFill(0xd587ae);
        button.drawRoundedRect(0, 0, 200, 75, 16);

        const playText = new PIXI.Text("play");

        playText.style = this._getMainTextStyle(false);
        playText.x = 100;
        playText.anchor.set(0.5);
        playText.y = 30;

        button.addChild(playText);

        button.interactive = true
        button.on('pointerdown', () => this._onClick())
        button.on('pointerover', () => this._onHover())
        button.on('pointerout', () => this._onOut())

        this.playButton = button;

        const bg = new PIXI.Sprite(background);

        bg.x = -300;
        bg.tint = 0xc7c0cf
        bg.scale.set(0.5)

        stage.addChild(bg);
        stage.addChild(textPart1);
        stage.addChild(textPart2);
        // stage.addChild(textPart3);
        stage.addChild(button);

    }

    private _getMainTextStyle(withGradient: boolean): PIXI.TextStyle {
        const textStyle = new PIXI.TextStyle({
            fillGradientType: 1,
            fillGradientStops: [
                0
            ],
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: 55,
            fontVariant: "small-caps",
            fontWeight: "bold",
            lineHeight: 50,
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

    private _onHover(): void {
        this.playButton.tint = 0xc7c0cf
    }

    private _onOut(): void {
        this.playButton.tint = 0xFFFFFF
    }
}