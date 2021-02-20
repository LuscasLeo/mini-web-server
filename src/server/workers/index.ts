import chalk from "chalk";
import { Worker } from "worker_threads";
import { createLogger } from "../../shared/utils";
import { makeWorker } from "./main.worker";
export type PoolMessageHeader = "run";
export type WorkerMessageHeader = "finished" | "ready";
export type Message<T, P = any> = { header: T; payload: P };

interface WorkerInstance {
	worker: Worker;
	name: string;
}

const [log, error, info] = createLogger(chalk`{yellow [WORKER POOL]}`);

export default class WorkerPool {
	private workerQueue: WorkerInstance[];

	running: boolean;
	finished: boolean;

	constructor() {
		this.workerQueue = [];
		this.running = false;
		this.finished = false;
	}

	async addPool(name: string) {
		const [log, logError, info] = createLogger(
			chalk`{red [WORKER INSTANCE {reset.bold ${name}}]}`
		);

		const worker = await this.instanceWorker(name);
		const instance: WorkerInstance = { name, worker };
		worker.on("message", (message) => this.onMessage(instance, message));
		worker.on("error", (a) => log(chalk`{bold - error}`, a));
		worker.on("exit", (a) => log(chalk`{bold -  exit}`, a));
		worker.on("messageerror", (a) =>
			log(chalk`{bold ${name} -  messageerror}`, a)
		);
		worker.on("online", () => log(chalk`{bold -  online}`));
		this.workerQueue.push(instance);

		return worker;
	}

	private onMessage(
		instance: WorkerInstance,
		message: Message<WorkerMessageHeader>
	) {}

	private async instanceWorker(name: string) {
		return makeWorker(name);
	}

	start() {
		this.running = true;
		this.finished = false;
	}

	stop() {
		this.running = this.finished = false;
	}
}
