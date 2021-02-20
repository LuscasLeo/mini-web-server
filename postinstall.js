const { promisify } = require("util");
const copy = require("copy");
const { existsSync } = require("fs");
const { mkdtemp, rmdir, rename } = require("fs").promises;
const { join } = require("path");

const ascopy = promisify(copy);
const COPY_FILES = {
	[join(".env.example")]: ".env",
};

(async function (files) {
	const tempdir = await mkdtemp("_DONT_TOUCH_");
	for (const tplFileName in files) {
		if (!existsSync(files[tplFileName])) {
			console.log(`copying file ${tplFileName} to ${files[tplFileName]}`);

			const joined = join(tempdir, tplFileName);

			await ascopy(tplFileName, tempdir);

			await rename(joined, files[tplFileName]);
		}
	}
	await rmdir(tempdir);
})(COPY_FILES);
