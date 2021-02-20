import chalk from "chalk";
import dotenv from "dotenv";
import Express from "express";
import { createServer } from "http";
import open from "open";
import path from "path";
import "regenerator-runtime";
import { isMainThread } from "worker_threads";
import { Server as WSServer } from "ws";
import { createLogger } from "../shared/utils";
import SessionManager from "../shared/websocket/sessions/SessionManager";
import { initializeServer } from "./websocket";
import { createHandlers } from "./websocket/handlers";
import WorkerPool from "./workers";
dotenv.config();

const developmentMode = process.env.NODE_ENV === "development";
const [log, error, info] = createLogger(chalk.green("[SERVER]"));

async function init() {
	const app = Express();

	const server = createServer(app);

	const wss = new WSServer({ server });

	const sessionManager = new SessionManager(wss);

	const workerPool = new WorkerPool();

	await Promise.all(
		["wanda", "pietro", "vision", "agnes"].map((name) =>
			workerPool.addPool(name)
		)
	);

	initializeServer(wss, createHandlers(sessionManager, workerPool));

	const { SERVER_PORT = 8010, SERVER_WS_PORT = 5221 } = process.env;

	app.use((req, res, next) => {
		res.set("Cache-Control", "no-store");
		next();
	});

	// if (!developmentMode)
	app.use("/", Express.static(path.join("dist", "client")));

	app.use("*", Express.static(path.join("dist", "client", "index.html")));

	info(
		`Starting server at mode ${
			developmentMode ? "DEVELOPMENT" : "PRODUCTION"
		}`
	);

	await new Promise<void>((rs, rj) => app.listen(SERVER_PORT, rs));
	info(
		`HTTP SERVER LISTENING TO PORT ${SERVER_PORT} (http://localhost:${SERVER_PORT})`
	);

	await new Promise<void>((rs, rj) => server.listen(SERVER_WS_PORT, rs));
	info(`WS SERVER LISTENING TO PORT ${SERVER_WS_PORT}`);

	if (!developmentMode) open(`http://localhost:${SERVER_PORT}`);
}

isMainThread &&
	init().catch((err) => {
		error(err);
		pause();
	});

function pause() {
	console.info("Press any key to exit");

	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.on("data", process.exit.bind(process, 0));
}
