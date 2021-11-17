import * as PIXI from "pixi.js"
import TextHelper from "./TextHelper"

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
        textPart1.style = TextHelper.getMainTextStyle(true);
        textPart1.x = this.screen.width / 2;
        textPart1.y = this.screen.height / 2 - 125;
        textPart1.anchor.set(0.5);

        const textPart2 = new PIXI.Text("and");
        textPart2.style = TextHelper.getSecondaryTextStyle();
        textPart2.x = this.screen.width / 2 - 20;
        textPart2.y = this.screen.height / 2 - 125;
        textPart2.anchor.set(0.5);

        const button = new PIXI.Graphics();
        button.x = this.screen.width / 2 - 100;
        button.y = this.screen.height / 2;
        button.beginFill(0xd587ae);
        button.drawRoundedRect(0, 0, 200, 75, 16);

        const playText = new PIXI.Text("play");

        playText.style = TextHelper.getMainTextStyle(false);
        playText.x = 100;
        playText.anchor.set(0.5);
        playText.y = 30;

        button.addChild(playText);

        button.interactive = true
        button.on('pointerdown', () => this._onClick())
        button.on('pointerover', () => this._onHover())
        button.on('pointerout', () => this._onOut())

        this.playButton = button;

        const bg = new PIXI.TilingSprite(background, screen.width, screen.height);

        bg.x = 0;
        bg.tint = 0xc7c0cf
        bg.tileScale.set(0.5)
        bg.tilePosition.x = -433
        bg.tilePosition.y = -5

        stage.addChild(bg);
        stage.addChild(textPart1);
        stage.addChild(textPart2);
        stage.addChild(button);

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