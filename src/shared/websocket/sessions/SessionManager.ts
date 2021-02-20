import WebSocket, { Server } from "ws";
import Message from "../messages/Message";
import { HeadersToMessages } from "../messages/types";
import { parseMessageToData } from "./Parser";

export default class SessionManager {
	private server: Server;

	constructor(server: Server) {
		this.server = server;
	}

	broadcast<
		H extends keyof HeadersToMessages,
		P extends HeadersToMessages[H]
	>(header: H, payload: P) {
		this.server.clients.forEach((client) => {
			if (client.readyState == WebSocket.OPEN) {
				client.send(parseMessageToData({ header, payload }));
			}
		});
	}
}
