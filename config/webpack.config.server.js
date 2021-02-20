const path = require("path");
const basepath = path.resolve(".");
const serversourcepath = path.resolve(basepath, "src", "server");
const sharedsourcepath = path.resolve(basepath, "src", "shared");
const ThreadsPlugin = require("threads-plugin");

/** @type import('webpack').Configuration */
module.exports = {
	target: "node",
	entry: {
		main: path.join(serversourcepath, "index"),
		"main.worker": path.join(serversourcepath, "workers", "main.worker"),
	},

	output: {
		path: path.join(basepath, "dist", "server"),
		// publicPath: "/dist/",
		filename: "[name].js",
		chunkFilename: "[id].js",
	},
	// plugins: [new ThreadsPlugin()],
	module: {
		rules: [
			// {
			// 	test: /\.worker\.ts$/,
			// 	include: [sharedsourcepath, serversourcepath],
			// 	use: [
			// 		{
			// 			loader: "raw-loader",
			// 		},
			// 		{
			// 			loader: "babel-loader",
			// 			options: {
			// 				plugins: [
			// 					"@babel/plugin-transform-modules-commonjs",
			// 					[
			// 						"module-resolver",
			// 						{
			// 							root: [
			// 								serversourcepath,
			// 								sharedsourcepath,
			// 							],
			// 							alias: {},
			// 						},
			// 					],
			// 				],
			// 				presets: [
			// 					[
			// 						"@babel/preset-env",
			// 						{
			// 							targets: {
			// 								esmodules: false,
			// 								node: true,
			// 							},
			// 							modules: "commonjs",
			// 						},
			// 					],
			// 					[
			// 						"@babel/preset-typescript",
			// 						{
			// 							transpileOnly: true,
			// 						},
			// 					],
			// 				],
			// 			},
			// 		},
			// 	],
			// },
			{
				test: /\.ts$/,
				include: [sharedsourcepath, serversourcepath],
				exclude: [path.resolve(basepath, "node_modules")],
				loader: "ts-loader",
				options: {
					compilerOptions: {
						module: "esnext",
						moduleResolution: "node",
						noImplicitAny: false,
						transpileOnly: true,
					},
					// presets: [
					// 	[
					// 		"@babel/env",
					// 		{
					// 			modules: false,
					// 		},
					// 	],
					// 	"@babel/preset-typescript",
					// ],
					// plugins: ["@babel/plugin-proposal-class-properties"],
				},
			},
		],
	},
	resolve: {
		extensions: [".json", ".js", ".ts"],
		alias: {},
		fallback: {},
	},

	externals: {
		bufferutil: "bufferutil",
		"utf-8-validate": "utf-8-validate",
		"tiny-worker": "tiny-worker",
		worker_threads: "worker_threads",
	},
	optimization: {
		usedExports: true,
	},
	devtool: "source-map",
	stats: {},
};
