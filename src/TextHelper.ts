import * as PIXI from "pixi.js"

export default class TextHelper {

    static getMainTextStyle(withGradient: boolean, fontSize?: number): PIXI.TextStyle {
        const textStyle = new PIXI.TextStyle({
            fillGradientType: 1,
            fillGradientStops: [
                0
            ],
            fontFamily: "\"Courier New\", Courier, monospace",
            fontSize: fontSize ?? 55,
            fontVariant: "small-caps",
            fontWeight: "bold",
            lineHeight: 50,
            // align: "center"
        });

        let fillArray = ["white"];

        if (withGradient) {
            fillArray.push("#b5d4dd");
        }

        textStyle.fill = fillArray;

        return textStyle;
    }

    static getSecondaryTextStyle(): PIXI.TextStyle {
        return new PIXI.TextStyle({
            fontFamily: 'cedarvilleCursive',
            fontSize: 40,
            fill: 0xd27da8
        });
    }
}