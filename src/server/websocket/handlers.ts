import chalk from "chalk";
import { v4 as uuid } from "uuid";

import { createLogger } from "../../shared/utils";
import { MessagesHandler } from "../../shared/websocket/handlers/Handler";
import { MessageHeader } from "../../shared/websocket/messages/types";
import ServerSocketSession from "../../shared/websocket/sessions/ServerSocketSession";
import SessionManager from "../../shared/websocket/sessions/SessionManager";
import WorkerPool from "../workers";

const [log, error, info] = createLogger(chalk.blue("[CLIENT]"));

enum ConfigTypes {
	BROWSER_PATH = "BROWSER_PATH",
}

const config: Record<ConfigTypes, string | undefined> = {
	BROWSER_PATH: undefined,
};

export function createHandlers(
	server: SessionManager,
	workerPool: WorkerPool
): MessagesHandler<ServerSocketSession> {
	return {
		[MessageHeader.HANDSHAKE]({ message }) {
			log(`Received HANDSHAKE message form client: ${message}`);
		},
	};
}
