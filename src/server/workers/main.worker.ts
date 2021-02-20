import { existsSync } from "fs";
import { join } from "path";
import { isMainThread, parentPort, Worker } from "worker_threads";
import { Message, PoolMessageHeader, WorkerMessageHeader } from ".";

if (!isMainThread && parentPort) {
	parentPort.on(
		"message",
		async ({ header, payload }: Message<PoolMessageHeader, any>) => {}
	);
}

export const filee = __filename;

export const makeWorker = (name: string) => {
	if (process.env.UNCOMPILED) {
		return new Worker(
			`
		const {workerData} = require("worker_threads");
		require("ts-node").register({
			transpileOnly: true
		});
		require(workerData.file);
		`,
			{ eval: true, workerData: { file: __filename, name } }
		);
	}
	const filename = find(
		join(process.cwd(), "server", "workers", "main.worker.js"),
		join(__dirname, "main.worker.js"),
		__filename
	);
	return new Worker(filename, { workerData: { name } });
};

function find(...paths: string[]) {
	for (const path of paths) {
		if (existsSync(path)) return path;
	}

	throw new Error("No existing path for any given strings");
}
