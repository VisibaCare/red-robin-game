import * as path from "path"
import * as url from "url"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"

export default {
    mode: "development",
    entry: "./src/main.ts",
    output: {
        path: path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "dist"),
        filename: "[name].js",
        clean: true,
    },
    module: {
        rules: [{ test: /\.ts$/, use: "ts-loader" }],
    },
    resolve: {
        extensions: [".js", ".ts"],
    },
    devtool: "eval-source-map",
    devServer: {
        static: "dist",
    },
    plugins: [
        new HtmlWebpackPlugin({ title: "hoh" }),
        new CopyWebpackPlugin({ patterns: [{ from: "assets", to: "assets" }] }),
    ],
}
