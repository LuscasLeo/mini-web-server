const HtmlWebpackPlugin = require("html-webpack-plugin");
const ErrorOverlayWebpackPlugin = require("error-overlay-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const DotenvWebpackPlugin = require("dotenv-webpack");
require("dotenv").config();

const basepath = path.resolve(".");
const sourcepath = path.resolve(basepath, "src");
const clientsourcepath = path.resolve(sourcepath, "client");
const sharedsourcepath = path.resolve(sourcepath, "shared");

const { CLIENT_DEBUG_PORT } = process.env;

/** @type import('webpack').Configuration */
module.exports = {
	mode: "development",
	target: "web",
	entry: [path.join(clientsourcepath, "index")],
	output: {
		path: path.join(basepath, "dist", "client"),
		// publicPath: "/dist/",
		filename: "bundle.js",
		chunkFilename: "[name].js",
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "public/index.html",
		}),
		new ErrorOverlayWebpackPlugin(),
		new DotenvWebpackPlugin(),

		new webpack.ProvidePlugin({
			process: "process/browser",
		}),
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
		}),
	],
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /.(j|t)sx?$/,
				include: [clientsourcepath, sharedsourcepath],
				exclude: [path.resolve(basepath, "node_modules")],
				loader: "babel-loader",
				options: {
					plugins: ["react-hot-loader/babel"],
					presets: [
						"@babel/preset-react",
						"@babel/preset-typescript",
						[
							"@babel/preset-env",
							{
								targets: {
									browsers: "last 2 chrome versions",
								},
							},
						],
					],
				},
			},
			{
				test: /\.(jpg|png|gif|svg|mp3|mp4|wav|ogg|webp)$/,
				use: "file-loader",
			},
		],
	},
	resolve: {
		extensions: [".json", ".js", ".jsx", ".ts", ".tsx"],
		alias: {
			process: "process/browser",
			"react-dom": "@hot-loader/react-dom",
		},
		fallback: {
			Buffer: require.resolve("buffer"),
			stream: require.resolve("stream-browserify"),
		},
	},
	devtool: "source-map",
	devServer: {
		// contentBase: path.join(basepath, "dist", "client"),
		inline: true,
		// host: "0.0.0.0",
		port: CLIENT_DEBUG_PORT,
		historyApiFallback: true,
	},
};
