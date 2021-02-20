import chalk from "chalk";
import { Server } from "ws";
import { createLogger } from "../../shared/utils";
import {
	handleMessage,
	MessagesHandler,
} from "../../shared/websocket/handlers/Handler";
import { MessageHeader } from "../../shared/websocket/messages/types";

import ServerSocketSession from "../../shared/websocket/sessions/ServerSocketSession";

const [log, logError] = createLogger(
	chalk.greenBright("[WEBSOCKET SERVER LISTENER]")
);

export function initializeServer(
	server: Server,
	handlers: MessagesHandler<ServerSocketSession>
) {
	server.on("connection", (clientSocket, request) => {
		log(
			`new connection from ${request.socket.remoteAddress}:${request.socket.remotePort}`
		);

		const clientSession = new ServerSocketSession(clientSocket, request);

		clientSession.send(MessageHeader.HANDSHAKE, {
			message: "Hello from server",
		});

		clientSession.onMessage((message) => {
			handleMessage(handlers, message, clientSession);
		});

		clientSocket.on("close", (code, reason) => {
			log("connection closed");
			handleMessage(
				handlers,
				{
					header: MessageHeader.CONNECTION_CLOSE,
					payload: { code, reason },
				},
				clientSession
			);
		});

		clientSocket.on("error", (error) => {
			handleMessage(
				handlers,
				{ header: MessageHeader.CONNECTION_ERROR, payload: { error } },
				clientSession
			);
		});

		clientSocket.on("open", () => {
			log("socket open");
			handleMessage(
				handlers,
				{ header: MessageHeader.CONNECTION_OPEN, payload: {} },

				clientSession
			);
		});

		clientSocket.on("ping", (data) => {
			handleMessage(
				handlers,
				{ header: MessageHeader.CONNECTION_PING, payload: { data } },
				clientSession
			);
		});

		clientSocket.on("pong", (data) => {
			handleMessage(
				handlers,
				{ header: MessageHeader.CONNECTION_PONG, payload: { data } },
				clientSession
			);
		});

		clientSocket.on("unexpected-response", (request, response) => {
			log(
				`Unexpected response from socket: ${request.headersSent}, ${response.headers}`
			);
			handleMessage(
				handlers,
				{
					header: MessageHeader.CONNECTION_UNEXPECTED_RESPONSE,
					payload: { request, response },
				},
				clientSession
			);
		});
	});

	server.on("close", () => {});

	server.on("error", (error) => {
		logError(error);
	});
}
