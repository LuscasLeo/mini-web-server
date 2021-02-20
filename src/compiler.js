const { compile } = require("nexe");
const path = require("path");
const copy = require("copy");
const { promisify } = require("util");
const rimraf = require("rimraf").sync;
// const getDependencies = require("get-dependencies");

const fs = require("fs");
const { exec } = require("child_process");
const { unlink, rmdir } = require("fs").promises;

const dist = path.resolve(".", "dist");
const clientdist = path.join(dist, "client");
const serverdist = path.join(dist, "server");
const outputpath = "release";

/**
 *
 * @param {string} dir
 */
async function createDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}

async function npmInstall() {
	await new Promise(function (resolve, reject) {
		const child = exec("npm install --production", {
			cwd: outputpath,
		});
		child.addListener("error", reject);
		child.addListener("exit", resolve);
	});
}

async function deleteModules() {
	if (fs.existsSync(path.join(outputpath, "package-lock.json")))
		await unlink(path.join(outputpath, "package-lock.json"));
	rimraf(path.join(outputpath, "node_modules"));
}

async function init() {
	const importModules = {
		chalk: "^4.1.0",
		"puppeteer-core": "^7.1.0",
	};

	const packagedModules = {
		chalk: "^4.1.0",
		// "puppeteer-core": "^7.1.0",
		uuid: "^8.3.2",
	};

	await createDir(outputpath);

	fs.writeFileSync(
		path.join(outputpath, "package.json"),
		JSON.stringify({
			dependencies: {
				// ...importModules,
				...packagedModules,
			},
		})
	);

	await deleteModules();

	await npmInstall();

	await promisify(copy)(path.join("dist", "server", "**", "*"), outputpath);

	await compile({
		input: path.join(outputpath, "server", "index.js"),
		targets: ["windows-x64-14.15.3", "windows-x86-14.15.3"],
		resources: [
			path.join(outputpath, "server", "**", "*"),
			path.join(outputpath, "shared", "**", "*"),
			path.join(clientdist, "**", "*"),
			path.join(outputpath, "node_modules", "**", "*"),
			// ...Object.keys(importModules).map((e) =>
			// 	path.join(outputpath, "node_modules", e, "**", "*")
			// ),
		],
		output: path.join(outputpath, "mini-server.exe"),
		verbose: true,
		debugBundle: true,
	});

	await deleteModules();

	fs.writeFileSync(
		path.join(outputpath, "package.json"),
		JSON.stringify({
			dependencies: {
				...importModules,
				// ...packagedModules,
			},
		})
	);

	npmInstall();

	await promisify(copy)(".env", outputpath);
}

init().catch(console.error);
